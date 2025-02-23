import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import requestsRouter from './routes/requests';
import YAML from 'yamljs';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load('./docs/swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/requests', requestsRouter);

app.get('/', (req, res) => {
  res.send('Support Request API is running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}.`);
});
