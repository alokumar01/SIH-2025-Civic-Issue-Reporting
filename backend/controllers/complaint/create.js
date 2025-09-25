import Complaint from '../../models/complaint.js';
import cloudinary from '../../config/cloudinary.js';
import ApiError from '../../utils/ApiError.js';
import logger from '../../config/logger.js';

// Helper to upload a single file buffer to Cloudinary using upload_stream with compression
const uploadToCloudinary = (file, folder, resourceType = 'auto') => {
  // Set transformation options for compression
  let transformation = [];
  if (resourceType === 'image') {
    transformation = [
      { quality: 'auto:good', fetch_format: 'auto', width: 1280, crop: 'limit' }
    ];
  } else if (resourceType === 'video') {
    transformation = [
      { quality: 'auto:good', fetch_format: 'auto', width: 1280, crop: 'limit' }
    ];
  } else if (resourceType === 'audio') {
    // Cloudinary treats audio as video, but you can set bitrate
    transformation = [
      { audio_codec: 'aac', bit_rate: '64k' }
    ];
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        transformation,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });
};

// @desc    File a new complaint
// @route   POST /api/complaints
// @access  Private
export const fileComplaint = async (req, res, next) => {
  try {
    // Extract and validate required fields
    const {
      title,
      description,
      state,
      district,
      locality,
      pinCode,
      address,
      landmark,
      category,
      priority,
    } = req.body;

    // Required string fields
    if (!title || !state || !district || !locality || !pinCode || !category) {
      return next(new ApiError(400, 'Missing required fields: title, state, district, locality, pinCode, category'));
    }

    // Validate pinCode
    if (!/^\d{6}$/.test(pinCode)) {
      return next(new ApiError(400, 'Pin code must be a 6-digit number'));
    }

    // Parse location
    let parsedLocation = {};
    // Try JSON.parse first (for raw JSON or stringified object)
    if (req.body.location) {
      try {
        const loc = typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location;
        if (loc && Array.isArray(loc.coordinates) && loc.coordinates.length === 2) {
          parsedLocation.coordinates = [parseFloat(loc.coordinates[0]), parseFloat(loc.coordinates[1])];
        }
      } catch (e) {
        // ignore JSON parse error, fallback below
      }
    }
    if (!parsedLocation.coordinates) {
      if (req.body['location[coordinates][0]'] && req.body['location[coordinates][1]']) {
        // Postman form-data style: location[coordinates][0], location[coordinates][1]
        parsedLocation.coordinates = [
          parseFloat(req.body['location[coordinates][0]']),
          parseFloat(req.body['location[coordinates][1]'])
        ];
      } else if (req.body.longitude && req.body.latitude) {
        parsedLocation.coordinates = [parseFloat(req.body.longitude), parseFloat(req.body.latitude)];
      }
    }
    if (!parsedLocation.coordinates || parsedLocation.coordinates.length !== 2 ||
      isNaN(parsedLocation.coordinates[0]) || isNaN(parsedLocation.coordinates[1])) {
      return next(new ApiError(400, 'location.coordinates is required and must be [longitude, latitude]'));
    }

    // Handle department (ObjectId or undefined)
    let department = req.body.department;
    if (department === '' || department === undefined) department = undefined;

    // Handle relatedComplaints (array of ObjectId)
    let relatedComplaints = req.body.relatedComplaints;
    if (typeof relatedComplaints === 'string') {
      // Single value or comma-separated
      if (relatedComplaints.trim() === '' || relatedComplaints === '[]') {
        relatedComplaints = [];
      } else if (relatedComplaints.startsWith('[') && relatedComplaints.endsWith(']')) {
        // JSON array string
        try {
          relatedComplaints = JSON.parse(relatedComplaints);
        } catch {
          relatedComplaints = [];
        }
      } else if (relatedComplaints.includes(',')) {
        relatedComplaints = relatedComplaints.split(',').map(x => x.trim()).filter(Boolean);
      } else {
        relatedComplaints = [relatedComplaints];
      }
    } else if (!Array.isArray(relatedComplaints)) {
      relatedComplaints = [];
    }
    // Remove empty strings
    relatedComplaints = relatedComplaints.filter(x => x && x !== '');

    // Handle tags (array of string)
    let tags = req.body.tags;
    if (typeof tags === 'string') {
      if (tags.trim() === '' || tags === '[]') {
        tags = [];
      } else if (tags.startsWith('[') && tags.endsWith(']')) {
        try {
          tags = JSON.parse(tags);
        } catch {
          tags = [];
        }
      } else if (tags.includes(',')) {
        tags = tags.split(',').map(x => x.trim()).filter(Boolean);
      } else {
        tags = [tags];
      }
    } else if (!Array.isArray(tags)) {
      tags = [];
    }

    // Handle media uploads
    const media = { images: [], voiceRecordings: [], videos: [] };

    // Images captions from user (form-data: imagesCaptions[])
    let imagesCaptions = req.body.imagesCaptions;
    if (typeof imagesCaptions === 'string') {
      try {
        imagesCaptions = JSON.parse(imagesCaptions);
      } catch {
        imagesCaptions = [imagesCaptions];
      }
    } else if (!Array.isArray(imagesCaptions)) {
      imagesCaptions = [];
    }

    // Images
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const result = await uploadToCloudinary(img, 'complaints/images', 'image');
        const caption = imagesCaptions[i] || img.originalname;
        media.images.push({ url: result.secure_url, caption, uploadedAt: new Date() });
      }
    }

    // Voice Recordings (audio)
    if (req.files && req.files.voiceRecordings) {
      const audios = Array.isArray(req.files.voiceRecordings) ? req.files.voiceRecordings : [req.files.voiceRecordings];
      for (const audio of audios) {
        const result = await uploadToCloudinary(audio, 'complaints/audio', 'audio');
        media.voiceRecordings.push({ url: result.secure_url, duration: null, uploadedAt: new Date() });
      }
    }

    // Videos captions from user (form-data: videosCaptions[])
    let videosCaptions = req.body.videosCaptions;
    if (typeof videosCaptions === 'string') {
      try {
        videosCaptions = JSON.parse(videosCaptions);
      } catch {
        videosCaptions = [videosCaptions];
      }
    } else if (!Array.isArray(videosCaptions)) {
      videosCaptions = [];
    }

    // Videos
    if (req.files && req.files.videos) {
      const videos = Array.isArray(req.files.videos) ? req.files.videos : [req.files.videos];
      for (let i = 0; i < videos.length; i++) {
        const vid = videos[i];
        const result = await uploadToCloudinary(vid, 'complaints/videos', 'video');
        const caption = videosCaptions[i] || vid.originalname;
        media.videos.push({ url: result.secure_url, caption, uploadedAt: new Date() });
      }
    }

    // Create complaint
    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      description,
      media,
      location: parsedLocation,
      state,
      district,
      locality,
      pinCode,
      address,
      landmark,
      category,
      department,
      priority,
      tags,
      relatedComplaints,
    });

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    logger.error('Error filing complaint:', error);
    next(error);
  }
};
