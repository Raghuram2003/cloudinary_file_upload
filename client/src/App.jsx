import axios from "axios"
import { useEffect, useState } from "react"


function App() {
  const [file,setFile] = useState(null)
  const [images,setImages] = useState([])

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
    console.log(response.data)               
    setImages([...images,response.data])
  }

  useEffect(()=>{
    axios.get("/api/images")
      .then(response=>{
        console.log(response.data);
        setImages(response.data)
      });
  },[])
  return (
    <div className="bg-blue-200 h-full flex-col items-center">
      <form onSubmit={handleSubmit} className="w-96 mx-auto mb-12">
        <label className="block">File upload</label>
        <input type="file" onChange={handleFile} className="block"/>
        <button type="submit" className="block">Submit</button>
      </form>
      {images && (
        <div className="flex flex-wrap justify-center">
          {images.map((image) => (
            <img
              src={image.fileURL}
              key={image.id}
              alt={`Image ${image.id}`}
              className="m-2 w-1/2"
            />
          )
          )}
        </div>
      )}
    </div>
  )
}

export default App