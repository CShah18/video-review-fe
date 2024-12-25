import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

const UserProfile = () => {
  const { username } = useParams(); 
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState('');
  const [isFileValid, setIsFileValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false); // Track if the upload is in progress
  const [dialogMessage, setDialogMessage] = useState(''); // For the dialog box message

  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
  const allowedExtensions = ["mp4", "mov", "wmv", "avi", "mkv", "webm"];
  const allowedMimeTypes = [
    "video/mp4", "video/quicktime", "video/x-ms-wmv", "video/avi", "video/x-matroska", "video/webm"
  ];

  const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileName = selectedFile.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();
      const fileSize = selectedFile.size;
      const fileMimeType = selectedFile.type;

      if (fileSize > MAX_FILE_SIZE) {
        setFileInfo("File is too large. Maximum allowed size is 500 MB.");
        setIsFileValid(false);
        return;
      }

      if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(fileMimeType)) {
        setFileInfo("Invalid file type. Only MP4, MOV, WMV, AVI, MKV, or WebM files are allowed.");
        setIsFileValid(false);
        return;
      }

      setFile(selectedFile);
      setFileInfo(`Selected file: ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
      setIsFileValid(true);
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    setFile(null);
    setFileInfo('');
    setIsFileValid(false);
    setIsUploading(false)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !isFileValid) return;

    setIsSubmitting(true);
    setIsUploading(true);
    setProgress(0);

    document.getElementById('progress-bar').style.display = 'block';

    const formData = new FormData();
    formData.append("videoReview", file);
    formData.append("userName", formattedUsername);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://15.237.120.69:20101/api/v1/videoReview/submit', true);
    xhr.withCredentials = true;

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete); 
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        // Show success message
        setDialogMessage("Thanks for submitting the review!");
      } else {
        console.error('Submission failed:', xhr.responseText);
        setDialogMessage("File upload failed. Please try again.");
      }

      // Hide the progress bar and reset states
      document.getElementById('progress-bar').style.display = 'none';
      setFile(null);
      setFileInfo('');
      setProgress(0);
      setIsFileValid(false);
      setIsUploading(false);

      setIsSubmitting(false);

      // Show the dialog box and hide it after 5 seconds
      document.getElementById('dialog-box').style.display = 'block';
      setTimeout(() => {
        document.getElementById('dialog-box').style.display = 'none';
      }, 5000);
    };

    xhr.onerror = () => {
      console.error('Submission failed: Network error');
      setDialogMessage("File upload failed due to network error.");
      setIsSubmitting(false);

      // Show the dialog box and hide it after 5 seconds
      document.getElementById('dialog-box').style.display = 'block';
      setTimeout(() => {
        document.getElementById('dialog-box').style.display = 'none';
      }, 5000);
    };

    xhr.send(formData);
  };

  return (
    <div className="home">
      <div id="wrapper">
        <header id="header" className="header">
          <div className="container">
            <div className="header-main section">
              <div className="logo">
                <img src={`${process.env.PUBLIC_URL}/images/header-logo.svg`} alt="logo" />
              </div>
            </div>
          </div>
        </header>
        <main>
        <div className="name-section">
            <div className="container">
              <div className="name-wrap">
                <h3>Hello, <span>{formattedUsername}!</span></h3>
                <p>Thanks so much for agreeing to record a video testimonial! We really appreciate it.</p>
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
                  tincidunt ut laoreet dolore aliquam erat volutpat. Ut wisi enim ad minim.</p>
              </div>
            </div>
          </div>
          <div className="script-ideas-section">
            <div className="container">
              <div className="script-ideas-wrap">
                <h4>We are exactly your words around this script ideas:</h4>
                <div className="script-wrap">
                  <p> I’ve worked this team for several years now and they are the best I know. All of them
                    are truly professional. They have the patience of a surgeon when it comes to
                    modification and changes. You know when you have some expectations about the result and
                    you are just blown away because what you receive is way far above what you expected?
                    this is what I got.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="video-recording-section">
            <div className="container">
              <div className="Video-recording-wrap">
                <h3>Tips for a Good Video Recording:</h3>
                <div className="videos-wrap">
                  <ul>
                    <li>
                      <div className="img-wrap">
                      <a href="#/" style={{cursor: 'default', pointerEvents: 'none'}}>
                        <img src={`${process.env.PUBLIC_URL}/images/videos-recordeing-img1.png`} alt="Video Recording Tip 1" />
                        </a>
                      </div>
                      <div className="content-wrap">
                        <p>1080p HD video recording at<br /> 25 fps, 30 fps or 60 fps</p>
                      </div>
                    </li>
                    <li>
                      <div className="img-wrap">
                      <a href="#/" style={{cursor: 'default', pointerEvents: 'none'}}>
                        <img src={`${process.env.PUBLIC_URL}/images/videos-recordeing-img2.png`} alt="Video Recording Tip 2" />
                        </a>
                      </div>
                      <div className="content-wrap">
                        <p>Good lighting on your face. with nice<br /> background and no noise!</p>
                      </div>
                    </li>
                    <li>
                      <div className="img-wrap">
                      <a href="#/" style={{cursor: 'default', pointerEvents: 'none'}}>
                        <img src={`${process.env.PUBLIC_URL}/images/videos-recordeing-img3.png`} alt="Video Recording Tip 3" />
                        </a>
                      </div>
                      <div className="content-wrap">
                        <p>Make sure you distance 2-4 ft from <br />camera and center of frame.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="video-upload-section">
            <div className="container">
              <div className="video-upload-wrap">
                <div className="input-file">
                  <div className="input-file-wrap">
                    <input
                      type="file"
                      name="file"
                      id="file"
                      accept=".mp4, .mov, .wmv, .avi, .mkv, .webm, video/mp4, video/quicktime, video/x-ms-wmv, video/x-matroska, video/webm"
                      onChange={handleFileChange}
                    />
                    <p onClick={() => document.getElementById('file').click()} style={{ cursor: 'pointer' }} className="drop-file">Drag and drop video or &nbsp;<span>browse</span></p>
                    <p onClick={() => document.getElementById('file').click()} style={{ cursor: 'pointer' }} className="file-info" id="file-info">{fileInfo}</p>
                  </div>
                  <a
                    href='#/'
                    className={`submit ${isFileValid ? 'active' : 'disabled'}`}
                    id="submit-button"
                    onClick={handleSubmit}
                    disabled={!isFileValid || isSubmitting}
                  >
                    Submit
                  </a>
                  <a
                    href='#/'
                    className="submit active"
                    id="remove-file"
                    style={{ display: isUploading || !file ? 'none' : 'inline-block' }} // Hide cancel after submit
                    onClick={handleRemoveFile}
                  >
                    Cancel
                  </a>
                  <div className="progress-bar" id="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                      {progress}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="dialog-box" className="dialog-box" style={{ display: 'none' }}>
            <p id="dialog-message">{dialogMessage}</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
