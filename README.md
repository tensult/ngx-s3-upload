# Amazon S3 Setup
* Create Bucket for uploads and update src/app/upload/config.ts file accordingly.
* Enable CORS following CORS permissions to upload.
```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <ExposeHeader>ETag</ExposeHeader>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```
# Amazon Cognito Setup
* Create cognito user pool.
* Create cognito identity pool and associate with user pool.
* Associate role with PutObject permission for your upload buckets.
* Update src/app/auth/config.ts accordingly.
* For more info read [this](https://medium.com/tensult/s3-direct-upload-with-cognito-authentication-56a5c0ff4916).

# Home page
When you start application, first this page will be opened.
![home](https://user-images.githubusercontent.com/30007458/38555020-4ccdb3ec-3ce2-11e8-966d-431680d6cd5b.png)

# Signin page
![signin](https://user-images.githubusercontent.com/30007458/38555175-d204ee86-3ce2-11e8-9383-7ca1d570a06c.png)

# Upload page
* After signin this page will be opened. 
* You can add one file or multiple files by clicking on `add files` button.
![upload](https://user-images.githubusercontent.com/30007458/38555258-243eae76-3ce3-11e8-86c5-fe79fabbfb2a.png)
* After adding one file or multiple files, you can upload those files by clicking on `upload all` button or individually by clicking on `upload` button. 
* Also you can clear and cancel.
![upload-1](https://user-images.githubusercontent.com/30007458/38555284-35fd3f06-3ce3-11e8-9f71-aeb034e83afe.png)
* You can signout by clicking on `signout` link.
![signout](https://user-images.githubusercontent.com/30007458/38556442-54068062-3ce7-11e8-9dee-33d32a92fe12.png)

# Uploaded files
* After clicking on `Downloads` link from upload page, this page will be opened. 
* Here you can see those files you uploaded.
![downloads](https://user-images.githubusercontent.com/30007458/38556505-8c08bc5a-3ce7-11e8-8ddd-d83c28de6680.png)

**Note:**
We are uploading files at a folder named by your email in S3 bucket. 

