## Getting Started

First, run the development server:

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Example systemd file

```[Unit]
Description=Inventory
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/inventory/inventory
User=inventory
Environment="NODE_ENV=production"
ExecStart=/bin/bash -c ". ~/.bashrc ; /opt/inventory/.local/share/pnpm/pnpm run start"

[Install]
WantedBy=multi-user.target
```

## Update steps on server

```sudo systemctl stop inventory
git pull
pnpm install
pnpx prisma migrate deploy
pnpx prisma generate --sql
pnpm build
sudo systemctl start inventory
```