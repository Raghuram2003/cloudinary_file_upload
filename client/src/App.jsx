import axios from "axios"
import { useState } from "react"


function App() {
  const [file,setFile] = useState(null)
  const [image,setImage] = useState(null)
  function handleFile(ev){
    console.log(ev.target.files)
    setFile(ev.target.files[0])
  }
  async function handleSubmit(e){
    e.preventDefault() 
    console.log(file)
    const formData = new FormData();
    formData.append('file',file);
    const response = await axios.post("/api/file",formData)
    console.log(response)               
    setImage(response.data)
  }
  return (
    <div className="bg-blue-200 h-screen flex items-center">
      <form onSubmit={handleSubmit} className="w-96 mx-auto mb-12">
        <label className="block">File upload</label>
        <input type="file" onChange={handleFile} className="block"/>
        <button type="submit" className="block">Submit</button>
        {image && (
          <img src={image} className="h-full w-full block"/>
        )}
      </form>
    </div>
  )
}

export default App
