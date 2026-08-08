const mongoose = require("mongoose");
const dns = require("dns").promises;

const connectDB = async () => {
  let uri = process.env.MONGO_URI;
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn("Standard MongoDB connection failed:", error.message);

    if (uri && uri.startsWith("mongodb+srv://")) {
      console.log("Attempting fallback SRV resolution via public DNS...");
      try {
        const dnsModule = require("dns");
        const originalServers = dnsModule.getServers();
        dnsModule.setServers(["8.8.8.8", "1.1.1.1"]);

        const withoutProtocol = uri.slice("mongodb+srv://".length);
        const slashIndex = withoutProtocol.indexOf("/");
        const authority = slashIndex === -1 ? withoutProtocol : withoutProtocol.slice(0, slashIndex);
        const pathAndOptions = slashIndex === -1 ? "" : withoutProtocol.slice(slashIndex);

        let credentials = "";
        let host = authority;
        if (authority.includes("@")) {
          const parts = authority.split("@");
          credentials = parts[0] + "@";
          host = parts[1];
        }

        const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${host}`);
        const hosts = srvRecords.map(r => `${r.name}:${r.port}`).join(",");

        let txtParams = "";
        try {
          const txtRecords = await dns.resolveTxt(host);
          const params = txtRecords.flat().join("&");
          if (params) {
            txtParams = (pathAndOptions.includes("?") ? "&" : "?") + params;
          }
        } catch (txtErr) {
          console.warn("TXT record resolution failed:", txtErr.message);
        }

        let directUri = `mongodb://${credentials}${hosts}${pathAndOptions}${txtParams}`;
        if (!directUri.includes("ssl=")) {
          directUri += (directUri.includes("?") ? "&" : "?") + "ssl=true";
        }

        try {
          dnsModule.setServers(originalServers);
        } catch (restoreErr) {
          // ignore restore failure
        }

        console.log("Connecting using direct fallback URI...");
        const conn = await mongoose.connect(directUri);
        console.log(`MongoDB Connected (via fallback): ${conn.connection.host}`);
        return;
      } catch (fallbackError) {
        console.error("Fallback SRV resolution failed:", fallbackError.message);
      }
    }

    process.exit(1);
  }
};

module.exports = connectDB;

