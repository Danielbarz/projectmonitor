const router = require('express').Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure Multer (Memory Storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'text/csv' || 
        file.originalname.endsWith('.xlsx') || 
        file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx and .csv formats are allowed!'), false);
    }
  }
});

// Protect all routes
router.use(auth);

// Import projects
router.post('/import', upload.single('file'), projectController.importProjects);

// Reset ALL projects
router.delete('/reset', projectController.resetProjects);

// GET all projects
router.get('/', projectController.getAllProjects);

// GET single project
router.get('/:id', projectController.getProjectById);

// CREATE new project
router.post('/', projectController.createProject);

// UPDATE project
router.put('/:id', projectController.updateProject);

// DELETE project
router.delete('/:id', projectController.deleteProject);

module.exports = router;