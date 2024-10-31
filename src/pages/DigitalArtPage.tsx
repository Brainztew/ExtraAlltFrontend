const DigitalArtPage = () => {
    const images = [
        {id: 1, url: "/pictures/RobotBackground.png"},
        {id: 2, url: "/pictures/user.png"},
        {id: 3, url: "/pictures/ai.png"},
        {id: 4, url: "/pictures/Background_edited.png"},
        {id: 5, url: "/pictures/other.png"},
    ];
    return (
        <div>
        <h3>Digital Art Page</h3>
        <p>Every picture is made by AI therefore is under open license. Feel free to use them for personal purpose! </p>
        <div className="Gallery">
            {images.map((image) => (
                <div key={image.id} className="GalleryItem">
                    <img className="GalleryPic" src={image.url} />
                <a href={image.url} target="_blank" rel="noopener noreferrer">
                <button>Full picture</button>
                </a>
                </div>
            ))}
        </div>
        
        </div>
    );
    }

    export default DigitalArtPage;