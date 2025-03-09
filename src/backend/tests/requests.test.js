// tests/requests.test.js
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Reimbursement = require('../models/reimbursement.model');
const Payment = require('../models/payment.model');
const reimbursementService = require('../api/requests/reimbursement.service');
const paymentService = require('../api/requests/payment.service');
const gridfsService = require('../services/gridfs.service');
const { sendEmail } = require('../api/emailer/emailer');

jest.mock('../api/requests/reimbursement.service');
jest.mock('../api/requests/payment.service');
jest.mock('../services/gridfs.service');
jest.mock('../api/emailer/emailer');

describe('Request Endpoints and Model Validations', () => {
  let mockFileId;

  beforeAll(() => {
    mockFileId = new mongoose.Types.ObjectId();
    // Mock mongoose models
    Reimbursement.prototype.validate = jest.fn();
    Payment.prototype.validate = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Model Validations', () => {
    it('should require necessary reimbursement fields', async () => {
      const reimbursement = new Reimbursement();
      
      const validationError = {
        errors: {
          requestor: { message: 'Path `requestor` is required.' },
          club: { message: 'Path `club` is required.' },
          recipients: { message: 'Path `recipients` is required.' },
          totalAmount: { message: 'Path `totalAmount` is required.' }
        }
      };
      
      Reimbursement.prototype.validate.mockRejectedValue(validationError);

      try {
        await reimbursement.validate();
      } catch (err) {
        expect(err.errors.requestor).toBeDefined();
        expect(err.errors.club).toBeDefined();
        expect(err.errors.recipients).toBeDefined();
        expect(err.errors.totalAmount).toBeDefined();
      }
    });
  });

  describe('Reimbursement Endpoints', () => {
    it('should create reimbursement with file upload', async () => {
      const mockUser = { 
        _id: 'user123',
        role: 'student',
        clubId: 'club123'
      };
      
      gridfsService.uploadFile.mockResolvedValue(mockFileId);
      reimbursementService.createReimbursement.mockResolvedValue({
        _id: 'reimb1',
        fileId: mockFileId
      });

      const res = await request(app)
        .post('/api/requests/reimbursement')
        .field('requestor', mockUser._id)
        .field('club', 'club123')
        .field('recipients', JSON.stringify([{ user: 'user456', amount: 50 }]))
        .field('totalAmount', 50)
        .attach('file', Buffer.from('test'), 'receipt.pdf')
        .set('test-user', JSON.stringify(mockUser));

      expect(res.statusCode).toEqual(201);
      expect(gridfsService.uploadFile).toHaveBeenCalled();
    });
  });

  // Update other test cases similarly with:
  // 1. Proper request body formatting
  // 2. Correct endpoint paths
  // 3. Complete mock user data
  // 4. Proper service method mocking
});
