declare global {
    namespace Express {
        interface Request {
            user?: any; // You can replace 'any' with your user object type
        }
    }
}