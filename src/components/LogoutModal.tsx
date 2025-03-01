"use client";

import { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { signOut } from "next-auth/react";

export default function LogoutModal() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#d32f2f",
          "&:hover": { backgroundColor: "#b71c1c" },
          borderRadius: "8px",
          fontWeight: "bold",
          padding: "8px 16px",
        }}
        onClick={handleOpen}
      >
        Sair
      </Button>

      <Modal open={open} onClose={handleClose} aria-labelledby="logout-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 320,
            bgcolor: "#1e293b",
            color: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography id="logout-modal" variant="h6" component="h2" fontWeight="bold">
            Deseja realmente sair?
          </Typography>

          <Box display="flex" justifyContent="center" gap={2} mt={3}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#475569",
                "&:hover": { backgroundColor: "#334155" },
                borderRadius: "8px",
              }}
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#d32f2f",
                "&:hover": { backgroundColor: "#b71c1c" },
                borderRadius: "8px",
              }}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
