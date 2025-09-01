import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Copy, Share2, X as CloseIcon } from "lucide-react"
import { FaWhatsapp, FaInstagram } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export default function ShareDialog({ open, onClose, shareUuid }) {
  const shareUrl = `${window.location.origin}/chatbot/share/${shareUuid}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
  }
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
    instagram: `https://www.instagram.com/`, // no direct URL scheme, user pastes manually
  }
  return (
    <Dialog open={open} onOpenChange={onClose}  PaperProps={{ style: {backgroundColor: "#2c2d30", borderRadius: "1rem", color: "white", padding: "1.5rem"}}} >
      BackdropProps={{style: { backgroundColor: "rgba(0,0,0,0.7)" }}}>
      <DialogContent >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Share Session</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <CloseIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-2 border rounded-lg px-3 py-2">
            <span className="truncate text-sm">{shareUrl}</span>
            <Button size="icon" variant="ghost" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-4 justify-center">
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="h-7 w-7 text-green-500 hover:scale-110 transition" />
            </a>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="h-7 w-7 text-black hover:scale-110 transition" />
            </a>
            <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram className="h-7 w-7 text-pink-500 hover:scale-110 transition" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
