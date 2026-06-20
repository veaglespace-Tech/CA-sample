import express from 'express';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    console.log("CORS check for", origin);
    return callback(null, false);
  }
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.post('/api/auth/register', (req, res) => {
  res.send('REGISTER');
});

app.use((err, req, res, next) => {
  console.log("ERROR HANDLER CAUGHT:", err.message);
  res.status(500).json({ message: err.message });
});

app.listen(5005, () => console.log('Listening'));
