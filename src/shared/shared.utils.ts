import AWS from "aws-sdk";

// AWS 로그인
AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

// AWS S3 업로드
export const uploadToS3 = async (file, userId, folderName) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  // 파일 이름에 "/"를 붙이면 폴더를 만들고 폴더 안에 저장 가능
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      // 버킷 이름
      Bucket: "gwan-woo-jeong-instaclone-uploads",
      // 파일 이름
      Key: objectName,
      // 아무나 파일을 읽을 수 있음
      ACL: "public-read",
      // 파일 데이터 (blob, stream...)
      Body: readStream,
    })
    .promise();
  return Location;
};

/*
    upload의 리턴 값
    ~ upload {
    ETag: '"6fb637368dbbbde67590844e062f53b6"',
    Location: 'https://gwan-woo-jeong-instaclone-uploads.s3.amazonaws.com/1-1631350826190-KakaoTalk_Photo_2021-08-03-14-35-22.jpeg',
    key: '1-1631350826190-KakaoTalk_Photo_2021-08-03-14-35-22.jpeg',
    Key: '1-1631350826190-KakaoTalk_Photo_2021-08-03-14-35-22.jpeg',
    Bucket: 'gwan-woo-jeong-instaclone-uploads'
    }
    파일 위치를 리턴
*/
