import { Caption, DropZone, Stack, Thumbnail } from "@shopify/polaris"
import React, { useCallback, useState } from "react"
import axios from "axios"
const BUCKET = process.env.BUCKET

const ImageFileUploader = () => {
  const [files, setFiles] = useState([])

  const uploadImage = async (file) => {
    return axios
      .get("/api/upload-image", {
        params: {
          fileName: file.name,
          fileType: file.type,
        },
      })
      .then((res) => {
        const options = {
          headers: {
            "Content-Type": file.type,
          },
        }
        return axios.put(res.data.url, file, options)
      })
      .then((res) => {
        const { name } = res.config.data
        return {
          name,
          isUploading: true,
          url: `https://${BUCKET}.s3.amazonaws.com/${file.name}`,
        }
      })
  }
  const handleDropZoneDrop = useCallback(
    async (_dropFiles, acceptedFiles, _rejectedFiles) => {
      for (let i = 0; i < acceptedFiles.length; i++) {
        await uploadImage(acceptedFiles[i])
      }
      setFiles((files) => [...files, ...acceptedFiles])
    },
    []
  )

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"]

  const fileUpload = !files.length && <DropZone.FileUpload />
  const uploadedFiles = files.length > 0 && (
    <Stack vertical>
      {files.map((file, index) => (
        <Stack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={
              validImageTypes.indexOf(file.type) > 0
                ? window.URL.createObjectURL(file)
                : "https://cdn.shopify.com/s/files/1/0757/9955/files/New_Post.png?12678548500147524304"
            }
          />
          <div>
            {file.name} <Caption>{file.size} bytes</Caption>
          </div>
        </Stack>
      ))}
    </Stack>
  )

  return (
    <DropZone type="image" onDrop={handleDropZoneDrop}>
      {uploadedFiles}
      {fileUpload}
    </DropZone>
  )
}

export default ImageFileUploader
