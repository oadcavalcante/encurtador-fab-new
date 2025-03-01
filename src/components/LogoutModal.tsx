"use client";

import { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { signOut } from "next-auth/react";

export default function LogoutModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
    setLoading(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        sx={{ borderRadius: 2, fontWeight: "bold", px: 3, py: 1 }}
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
            bgcolor: "#1E3A8A",
            color: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography id="logout-modal" variant="h6" fontWeight="bold">
            Deseja realmente sair?
          </Typography>

          <Box display="flex" justifyContent="center" gap={2} mt={3}>
            <Button
              variant="contained"
              sx={{ bgcolor: "#475569", "&:hover": { bgcolor: "#334155" }, borderRadius: 2 }}
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ borderRadius: 2 }}
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "Saindo..." : "Sair"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
