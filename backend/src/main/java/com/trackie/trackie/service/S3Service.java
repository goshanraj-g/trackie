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

    public String uploadFile(MultipartFile file) throws IOException {
        // initialize client
        AmazonS3 s3 = getS3Client();
        // converts incoming spring Multipart file to regular java file (AWS SDK
        // putObject() requires File object)
        File temp = convertMultiPartToFile(file);
        // extracts original file name from uploaded file
        String fileName = file.getOriginalFilename();
        // uploads temp file to s3 bucket, bucket -> name of destination S3 bucket,
        // fileName -> name of file, temp -> actual file to upload
        s3.putObject(new PutObjectRequest(bucket, fileName, temp));
        // delete from servers local storage
        temp.delete();

        return fileName;
    }

    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        // create file with a safe unique name
        File tempFile = File.createTempFile("upload-", "=" + file.getOriginalFilename());
        // write the contents of the multipartfile to the temp file
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(file.getBytes());
        }
        // return file so it can bve used
        return tempFile;

    }

}
