package com.trackie.trackie.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.textract.AmazonTextract;
import com.amazonaws.services.textract.AmazonTextractClientBuilder;
import com.amazonaws.services.textract.model.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TextractService {

    @Value("${aws.accessKeyId}")
    private String accessKeyId;

    @Value("${aws.secretKey}")
    private String secretKey;

    @Value("${aws.region}")
    private String region;

    @Value("${aws.s3.bucket}")
    private String bucket;

    // Create Textract client using credentials and region
    private AmazonTextract getTextractClient() {
        BasicAWSCredentials creds = new BasicAWSCredentials(accessKeyId, secretKey);
        return AmazonTextractClientBuilder.standard()
                .withRegion(Regions.fromName(region))
                .withCredentials(new AWSStaticCredentialsProvider(creds))
                .build();
    }

    public String extractText(String fileName) {
        AmazonTextract textract = getTextractClient();

        // specifiy location of file in s3
        Document document = new Document().withS3Object(new S3Object().withName(fileName).withBucket(bucket));

        // request to analyse text
        AnalyzeDocumentRequest request = new AnalyzeDocumentRequest().withDocument(document).withFeatureTypes("FORMS");

        // send request to AWS Textract
        AnalyzeDocumentResult result = textract.analyzeDocument(request);

        // collect and return extracted lines of text
        StringBuilder sb = new StringBuilder();
        List<Block> blocks = result.getBlocks();

        for (Block block : blocks) {
            if ("LINE".equals(block.getBlockType())) {
                sb.append(block.getText()).append("\n");
            }
        }

        return sb.toString();

    }

}
