# Invoicerz

This is a personal utility application that generates a PDF invoice. This is built using `Next.js`, `shadcn`, `docx-templates`, and `libreoffice`.

## Running locally

This application can be ran using a Docker container. The container will build and install all dependencies including `libreoffice` for PDF generation.

```bash
docker compose up -d --build
```

That's it! You can now visit the app at [localhost:42069](http://localhost:42069).
