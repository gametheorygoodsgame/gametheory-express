import { Router } from 'express';
import { authenticateUser } from '../../common/middleware/authenticate';

const loginRouter = Router();

// Define the '/login/dozent' route
loginRouter.post('/dozent', authenticateUser, (req, res) => {
  // If the code reaches this point, it means the user is authenticated
  // You can include additional logic or send a response here
  res.json({ message: 'Authentication successful' });
});

export { loginRouter };
