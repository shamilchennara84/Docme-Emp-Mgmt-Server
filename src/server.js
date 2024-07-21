const app = require("./app");
const dotenv = require("./config/dotenv");

const PORT = dotenv.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
