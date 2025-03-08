"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import Header from "@/components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

interface UrlItem {
  id: string;
  original: string;
  short: string;
  clicks: number;
  createdAt: Date | string;
  userId?: string;
  [key: string]: any;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export default function ListPage() {
  const [rows, setRows] = React.useState<UrlItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [urlToDelete, setUrlToDelete] = React.useState<UrlItem | null>(null);
  const [snackbar, setSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpenSnackbar = (message: string, severity: SnackbarState["severity"] = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const columns: GridColDef[] = [
    { field: "original", headerName: "URL Original", width: 400 },
    {
      field: "short",
      headerName: "URL Encurtada",
      width: 250,
      renderCell: (params) => {
        const domain = process.env.NEXT_PUBLIC_BASE_URL;
        const fullUrl = `${domain}/${params.value}`;

        return (
          <a href={fullUrl} rel="noopener noreferrer" style={{ color: "#1976d2", fontWeight: "bold" }}>
            {fullUrl}
          </a>
        );
      },
    },
    { field: "clicks", headerName: "Cliques", width: 80 },
    {
      field: "createdAt",
      headerName: "Criado em",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return "Data inválida";

        return new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(params.value));
      },
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 100,
      renderCell: (params) => (
        <IconButton aria-label="delete" color="error" onClick={() => handleOpenDeleteDialog(params.row as UrlItem)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const handleOpenDeleteDialog = (url: UrlItem) => {
    setUrlToDelete(url);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUrlToDelete(null);
  };

  const handleDeleteUrl = async () => {
    if (!urlToDelete) return;

    try {
      const response = await fetch(`/api/urls/${urlToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRows(rows.filter((row) => row.id !== urlToDelete.id));
        handleOpenSnackbar("URL excluída com sucesso!");
      } else {
        const data = await response.json();
        handleOpenSnackbar(`Erro ao excluir URL: ${data.error}`, "error");
      }
    } catch (error) {
      console.error("Erro ao excluir URL:", error);
      handleOpenSnackbar("Erro ao excluir URL", "error");
    } finally {
      handleCloseDialog();
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/urls");
        const data = await response.json();
        const formattedData = data.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));

        setRows(formattedData);
      } catch (error) {
        console.error("Erro ao buscar URLs:", error);
        handleOpenSnackbar("Erro ao carregar URLs", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Box
        sx={{
          height: "80vh",
          width: "100%",
          margin: "20px auto",
          backgroundColor: "rgba(241, 241, 241, 0.842)",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            rows={rows}
            columns={columns}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
          />
        )}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirmar exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" component="span">
              Tem certeza que deseja excluir esta URL encurtada?
            </DialogContentText>
            {urlToDelete && (
              <Box component="div" sx={{ mt: 1 }}>
                <strong>Original:</strong> {urlToDelete.original}
                <br />
                <strong>Encurtada:</strong> {urlToDelete.short}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleDeleteUrl} color="error" autoFocus>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
