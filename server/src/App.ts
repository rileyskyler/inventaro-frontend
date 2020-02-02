import Express from "express";

const App = Express();
const PORT = 1337 || process.argv[0];

App.get("/", (req: Express.Request, res: Express.Response) =>
  res.send("Hello World!")
);

App.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
