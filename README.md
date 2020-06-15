# Shopify Drop Zone S3 Upload Example

Sample of uploading image file directly from browser to S3 using Shopify Drop Zone.

use shopify-app-cli.

https://github.com/Shopify/shopify-app-cli

## S3 cors config

Setting cors to upload files from another domain to S3

 ```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

## install

```
yarn
```


## config .env

copy .env.example to .env

## dev server

```
shopify serve
```

