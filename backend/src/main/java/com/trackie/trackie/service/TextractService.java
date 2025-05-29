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
        // initialize textract client
        AmazonTextract textract = getTextractClient();

        // creates a document object that tells textract where to find the file
        Document document = new Document().withS3Object(new S3Object().withName(fileName).withBucket(bucket));

        // request to send to aws textract that attaches file info, and asks textract to
        // look for form fields, and tables as well as raw text
        AnalyzeDocumentRequest request = new AnalyzeDocumentRequest().withDocument(document).withFeatureTypes("FORMS",
                "TABLES");

        // send request to AWS Textract, and recieve result
        // textrect will process the file and respond with a list of blocks (individual
        // pieces of information like lines, words, tables)
        AnalyzeDocumentResult result = textract.analyzeDocument(request);

        // collect and return extracted lines of text
        // accumulate and efficiently build the extracted text line-by-line
        StringBuilder sb = new StringBuilder();
        // rectrieve the list of blocks from textract repsonse
        List<Block> blocks = result.getBlocks();

        /// loop to process each block returned by textract
        for (Block block : blocks) {
            // ensure that the block only includes type LINE
            if ("LINE".equals(block.getBlockType())) {
                sb.append(block.getText()).append("\n");
            }
        }

        return sb.toString();

    }

}
