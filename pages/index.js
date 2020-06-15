import { Heading, Page } from "@shopify/polaris"
import React from "react"
import ImageFileUploder from "../components/ImageFileUploder"

const Index = () => {
  return (
    <Page>
      <Heading>Drop Zone Image Upload S3</Heading>

      <ImageFileUploder />

    </Page>
  )
}

export default Index
