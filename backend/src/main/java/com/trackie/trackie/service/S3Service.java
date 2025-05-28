package com.trackie.trackie.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

// connects app to amazon s3
// tells spring that this is a service component
@Service
public class S3Service {

    // pull values from application.properties
    @Value("${aws.accessKeyId}")
    private String accessKeyId;

    @Value("${aws.secretKey}")
    private String secretKey;

    @Value("${aws.region}")
    private String region;

    @Value("${aws.s3.bucket}")
    private String bucket;

    // create an Amazon S3 client with AWS access key, and secret key, region,
    // passing the credentials to the client
    // AmazonS3ClientBuilder is the factory which creates the client
    private AmazonS3 getS3Client() {
        BasicAWSCredentials creds = new BasicAWSCredentials(accessKeyId, secretKey);
        return AmazonS3ClientBuilder.standard().withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(creds)).build();
    }

    // create S3 client
    // convert multipartfile to a local file
    // gets orignal file name
    // uploads to s3 -> s3.putObject(new PutObjectRequest(bucket, fileName, temp));
    // deletes temp local file
    // returns file name (caller knows what got uploaded)

    public String uploadFile(MultipartFile file) throws IOException {
        AmazonS3 s3 = getS3Client();
        File temp = convertMultiPartToFile(file);
        String fileName = file.getOriginalFilename();

        s3.putObject(new PutObjectRequest(bucket, fileName, temp));
        temp.delete();

        return fileName;
    }

    // converts a multipartfile into a regular file object
    // converting to mpf is how spring handles uploaded files
    // this is requred because aws expects a file, and not a multipart file
    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }

}
