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

  let scriptIdea = ``;

  const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);

  switch (formattedUsername) {
    case 'Carlo':
      scriptIdea = `
        I started working with Jignesh, Chintan, and Webforest over five years ago on a simple website. Their design concepts amazed me from day one! <br /><br />
        Since then, they’ve been more than an agency—they’re my go-to partners. Every time I have an idea, they bring it to life with research, creativity, and cutting-edge technology. Chintan especially inspires me, making every idea feel like it’s already real. <br /><br />
        From design to development, their top-notch team handles everything. After years of working together, visiting them personally was an unforgettable experience. Webforest isn’t just an agency—they’re my partners in turning dreams into reality.
      `;
      break;

    case 'Bk':
      scriptIdea = `
        "Wow! Oh my God—Jignesh, Chintan, and the Webforest team! <br /><br />
        It’s been such a long journey with them. I still remember when we started working with Webforest—they hadn’t even finalized their business name back then! We began with a small design task, and now, over five years later, they handle all our projects. <br /><br />
        Chintan and Jignesh have built a team that never disappoints. Priya, especially, has been a game-changer. Since she joined, communication has become so smooth—she’s always responsive and knows exactly how to handle things. <br /><br />
        What makes Webforest special is how well they understand our clients’ needs and expectations. They’ve helped us grow, and they’ve grown too, delivering the best services every step of the way.
        Cheers to Webforest and our amazing partnership!"

      `;
      break;

    case 'Cody':
      scriptIdea = `
        As a marketing agency, we work with many clients on SEO, and having CRO-friendly website designs is crucial for us. <br /><br />
        Webforest has been an amazing partner in this journey. They don’t just create designs—they focus on best practices for CRO, ensuring the websites are perfectly aligned with our SEO and marketing goals. <br /><br />
        Our partnership with Webforest goes way back to the early days of Searchbloom, and they’ve been instrumental in supporting our growth. They truly feel like an extension of our team. <br /><br />
        They are miles away, but their team is incredibly responsive. Tasks and updates are always quick, and they make collaboration seamless. <br /><br />
        Wishing Webforest the very best and congratulations on completing 10 years!
      `;
      break;

    case 'Diego':
      scriptIdea = `
        When we decided to hire a dedicated resource, we were a bit unsure—how would they fit into our team? Would they understand our needs? But working with WebForest has completely exceeded our expectations! <br /><br />
        The onboarding process was seamless. Within days, our dedicated resource became an integral part of our operations, managing tasks with efficiency and precision
      `;
      break;
  
    default:
      scriptIdea = `
        I’ve worked this team for several years now and they are the best I know. All of them
        are truly professional. They have the patience of a surgeon when it comes to
        modification and changes. You know when you have some expectations about the result and
        you are just blown away because what you receive is way far above what you expected?
        this is what I got.
      `;
      break;
  }

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

    document.getElementById('submit-button').className = 'submit disabled';

    setIsSubmitting(true);
    setIsUploading(true);
    setProgress(0);

    document.getElementById('progress-bar').style.display = 'block';

    const formData = new FormData();
    formData.append("videoReview", file);
    formData.append("userName", formattedUsername);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://apis.sacglobal.co/video/submit', true);
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
                <p>Thank you so much for agreeing to record a video testimonial! We truly appreciate your time and support.</p>
              </div>
            </div>
          </div>
          <div className="script-ideas-section">
            <div className="container">
              <div className="script-ideas-wrap">
                <h4>We’ve got the script below for you, if you’re feeling a little lazy and don’t want to hunt for your own words 😊 :</h4>
                <div className="script-wrap">
                  <p dangerouslySetInnerHTML={{ __html: scriptIdea }} />
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
