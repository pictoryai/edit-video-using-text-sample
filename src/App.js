import { Box } from "@mui/material";
import EditorContainer from "./components/EditorContainer";
console.log("process")
console.log(process && process.env)
function App() {
  return (
    <Box sx={{ bgcolor: "#F7F7F7" }}>
      <EditorContainer />
    </Box>
  );
}

export default App;
