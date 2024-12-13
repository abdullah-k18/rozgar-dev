import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function JoinWaitlist({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!name || !email || !organization) {
      toast.warn("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      toast.warn("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "waitlist"), {
        name,
        email,
        organization,
      });

      setName("");
      setEmail("");
      setOrganization("");

      onClose();
      toast.success("You've joined the waitlist.");
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          Join Waitlist Now
        </DialogTitle>
        <Typography variant="body1" sx={{ padding: "0 16px", color: "#555" }}>
          Join thousands of successful job seekers who found their dream
          positions through Rozgar&apos;s AI-powered platform.
        </Typography>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{
              sx: {
                "&.Mui-focused": {
                  color: "black",
                },
              },
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
            }}
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              sx: {
                "&.Mui-focused": {
                  color: "black",
                },
              },
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
            }}
          />
          <TextField
            margin="dense"
            id="organization"
            label="Company / University"
            type="text"
            fullWidth
            variant="outlined"
            required
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            InputLabelProps={{
              sx: {
                "&.Mui-focused": {
                  color: "black",
                },
              },
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#4b8b93",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#397a7f",
              },
            }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
      />
    </>
  );
}
