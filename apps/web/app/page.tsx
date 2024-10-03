"use client";
import { useState, useRef } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";

export default function AlbumCoverMaker() {
  const [artistName, setArtistName] = useState("");
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumArt, setAlbumArt] = useState<File | null>(null);
  const [showParentalAdvisory, setShowParentalAdvisory] = useState(false);
  const [selectedCover, setSelectedCover] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const defaultCovers = [
    "/assets/cover1.png",
    "/assets/cover2.png",
    "/assets/cover3.png",
  ]; // Add paths to your default album cover images here

  const handleCoverSelect = (cover: string) => {
    setSelectedCover(cover);
    setAlbumArt(null); // Clear the uploaded art when a default cover is selected
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas || (!albumArt && !selectedCover)) {
      alert("Please upload the album art or select a default cover");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const albumArtImg = new Image();
    albumArtImg.src = albumArt ? URL.createObjectURL(albumArt) : selectedCover!; // Use the selected cover if no custom art

    albumArtImg.onload = () => {
      canvas.width = albumArtImg.width;
      canvas.height = albumArtImg.height;
      ctx.drawImage(albumArtImg, 0, 0);

      // Center artist name
      ctx.font = "bold 30px sans-serif"; // Customize font as needed
      ctx.fillStyle = "white"; // Customize color as needed
      const artistNameWidth = ctx.measureText(artistName).width;
      const artistNameX = (canvas.width - artistNameWidth) / 2; // Centering the text
      ctx.fillText(artistName, artistNameX, canvas.height - 100); // Adjust position as needed

      // Center album title
      ctx.font = "bold 24px sans-serif"; // Customize font as needed
      const albumTitleWidth = ctx.measureText(albumTitle).width;
      const albumTitleX = (canvas.width - albumTitleWidth) / 2; // Centering the text
      ctx.fillText(albumTitle, albumTitleX, canvas.height - 60); // Adjust position as needed

      // Add parental advisory if selected
      if (showParentalAdvisory) {
        const advisoryImg = new Image();
        advisoryImg.src = "/assets/parental.png"; // Ensure this image is in the public folder
        advisoryImg.onload = () => {
          const advisoryWidth = 100; // Customize size as needed
          const advisoryHeight = 100; // Customize size as needed
          ctx.drawImage(advisoryImg, canvas.width - advisoryWidth - 20, canvas.height - advisoryHeight - 20, advisoryWidth, advisoryHeight);
        };
      }
    };
  };

  return (
    <div className="container mx-auto py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Create Your Album Cover</h1>
      <div className="space-y-4 w-full max-w-md">
        <Input
          type="text"
          placeholder="Artist Name"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Album Title"
          value={albumTitle}
          onChange={(e) => setAlbumTitle(e.target.value)}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setAlbumArt(e.target.files?.[0] || null)}
          placeholder="Upload Album Art"
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showParentalAdvisory}
            onChange={() => setShowParentalAdvisory(!showParentalAdvisory)}
          />
          <label className="text-sm">Parental Advisory</label>
        </div>

        <Button onClick={handleSubmit}>Generate Album Cover</Button>

        {/* Default Album Covers */}
        <div className="flex space-x-4 justify-center mt-4">
          {defaultCovers.map((cover) => (
            <div
              key={cover}
              onClick={() => handleCoverSelect(cover)}
              className={`cursor-pointer border-2 p-2 transition-transform duration-200 ${
                selectedCover === cover ? "border-blue-500 rounded-lg ring-2 ring-blue-500" : "border-gray-300"
              }`}
            >
              <img
                src={cover}
                alt="Default Album Cover"
                className="w-32 h-32 object-cover rounded" // Set default size here
              />
            </div>
          ))}
        </div>

        {/* Canvas element to display the album cover */}
        <div className="mt-6">
          <canvas ref={canvasRef} className="border border-gray-300"></canvas>
        </div>
      </div>
    </div>
  );
}
