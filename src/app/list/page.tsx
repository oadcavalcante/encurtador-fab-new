"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import Header from "@/components/Header";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  { field: "original", headerName: "Original", width: 400 },
  { field: "short", headerName: "Encurtado", width: 200 },
  {
    field: "createdAt",
    headerName: "Criado em",
    flex: 1,
    renderCell: (params) => {
      if (!params.value) return "Data inválida";

      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(params.value));
    },
  },
];

export default function ListPage() {
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/urls"); // 🔥 Ajuste para pegar os dados do Prisma
        const data = await response.json();

        // 🔥 Converte `createdAt` antes de passar para a tabela
        const formattedData = data.map((item: { createdAt: string | number | Date }) => ({
          ...item,
          createdAt: new Date(item.createdAt), // Converte string para Date
        }));

        setRows(formattedData);
      } catch (error) {
        console.error("Erro ao buscar URLs:", error);
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
          backgroundColor: "#ffffff96",
          padding: "20px",
        }}
      >
        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={rows}
          columns={columns}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
}
