import express, {Express} from 'express';
import router from "./routes";

export const app: Express = express();

export function bootstrap() {
    app.use(router).listen(process.env.PORT || 3000, () => {
        console.log('Server is running on port 3000');
    });
}
