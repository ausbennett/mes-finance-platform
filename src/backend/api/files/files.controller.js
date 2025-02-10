const gridfsService = require('../../services/gridfs.service');
const mongoose = require('mongoose');

const getFile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid file id" });
    }
    
    const downloadStream = gridfsService.getFile(id);
    
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', 'attachment; filename="downloadedFile"');

    downloadStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      return res.status(404).json({ message: "File not found" });
    });
    
    downloadStream.pipe(res);
    
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFile,
};
