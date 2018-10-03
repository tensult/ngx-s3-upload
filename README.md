# Get started
This is a fully functional Angular 6 App to upload to S3 directly from browser using Cognito user and identity pools. For architecture and background details go [here](https://medium.com/tensult/s3-direct-upload-with-cognito-authentication-56a5c0ff4916).

## Installation
```
git clone https://github.com/tensult/ngx-s3-upload.git
cd ngx-s3-upload
npm install
```
## Starting the App
```
ng serve
```
Once app is successfully started: open http://localhost:4200/ in your browser
# Configure with your own AWS account
## Amazon S3 Setup
* Create Bucket for uploads and update the bucket details and your s3 bucket default region:[src/config/s3.ts](https://github.com/tensult/ngx-s3-upload/blob/master/src/config/s3.ts) accordingly.
* Enable CORS on S3 bucket with following CORS permissions.
```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <ExposeHeader>ETag</ExposeHeader>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```
![s3corspolicy](https://user-images.githubusercontent.com/33080863/42218959-e0a7a64e-7ee7-11e8-8535-a66d785e7193.png)
## Amazon Cognito Setup
* Create cognito user pool.
* Create cognito identity pool and associate with user pool.
* Associate role for authenticated users with cognito identity pool with PutObject permission to the S3 buckets. You can also refer to the my identity pool [policy](https://gist.github.com/koladilip/3b70c313a7071d12a83b818efa1abc75/).
* Update [src/config/cognito.ts](https://github.com/tensult/ngx-s3-upload/blob/master/src/config/cognito.ts) accordingly.

# Sample Screens
## Home page
* When you start application, first this page will be opened.
![home](https://user-images.githubusercontent.com/30007458/38555020-4ccdb3ec-3ce2-11e8-966d-431680d6cd5b.png)

## Signin page
* You have to do signin first for accessing *upload* feature.
![signin](https://user-images.githubusercontent.com/30007458/38555175-d204ee86-3ce2-11e8-9383-7ca1d570a06c.png)

## Upload page
* After signin this page will be opened. 
* You can add one file or multiple files by clicking on `add files` button.
![upload](https://user-images.githubusercontent.com/30007458/38555258-243eae76-3ce3-11e8-86c5-fe79fabbfb2a.png)
* After adding one file or multiple files, you can upload those files by clicking on `upload all` button or individually by clicking on `upload` button. 
* Also you can clear and cancel.
![upload-1](https://user-images.githubusercontent.com/30007458/38555284-35fd3f06-3ce3-11e8-9f71-aeb034e83afe.png)
* You can signout by clicking on `signout` link.
![signout](https://user-images.githubusercontent.com/30007458/38556442-54068062-3ce7-11e8-9dee-33d32a92fe12.png)

## Uploaded files page
* After clicking on `Downloads` link from upload page, this page will be opened. 
* Here you can see those files you uploaded.
![downloads](https://user-images.githubusercontent.com/30007458/38556505-8c08bc5a-3ce7-11e8-8ddd-d83c28de6680.png)

**Note:**
We are uploading files at a folder named by your email in S3 bucket. 

