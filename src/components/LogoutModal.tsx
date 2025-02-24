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
      <Button variant="contained" color="error" onClick={handleOpen}>
        Sair
      </Button>

      <Modal open={open} onClose={handleClose} aria-labelledby="logout-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="logout-modal" variant="h6" component="h2">
            Tem certeza que deseja sair?
          </Typography>

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Sair
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
