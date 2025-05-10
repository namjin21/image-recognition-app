import { listen } from "./app";
const port = process.env.PORT || 3001;

listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});