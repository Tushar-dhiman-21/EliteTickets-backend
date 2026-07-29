const app = require("./server");

const PORT = process.env.PORT || 6900;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});