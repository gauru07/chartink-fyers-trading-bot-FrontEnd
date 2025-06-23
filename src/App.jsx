import { useState } from "react";
import axios from "axios";

export default function App() {
  const [symbol, setSymbol] = useState("TATAMOTORS");
  const [price, setPrice] = useState("800");
  const [type, setType] = useState("2");
  const [capital, setCapital] = useState("100000");
  const [bufferInstant, setBufferInstant] = useState("0.09");
  const [bufferLimit, setBufferLimit] = useState("0.10");
  const [rr, setRR] = useState("1.5");
  const [risk, setRisk] = useState("1.0");
  const [status, setStatus] = useState("");
  const [responseJson, setResponseJson] = useState(null);
  const [enableInstant, setEnableInstant] = useState(true);
  const [enableLimit, setEnableLimit] = useState(true);
  const [enableLockProfit, setEnableLockProfit] = useState(false);
  const [testOnly, setTestOnly] = useState(false); // ✅ NEW toggle

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usedSymbol = testOnly ? "TATAMOTORS" : symbol;
      const usedPrice = testOnly ? "800" : price;

      const payload = {
        alert_id: `A-${Date.now()}`,
        stocks: usedSymbol,
        trigger_prices: usedPrice,
        triggered_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        scan_name: "Manual Test",
        scan_url: "manual-test",
        alert_name: "Frontend Test Alert",
        webhook_url: "https://chartink-fyers-trading-bot.onrender.com/api/chartink-alert",
        type: parseInt(type),
        capital: parseFloat(capital),
        buffer: parseFloat(type === "2" ? bufferInstant : bufferLimit),
        risk_reward: parseFloat(rr),
        enable_instant: enableInstant,
        enable_stoplimit: enableLimit,
        enable_lockprofit: enableLockProfit
      };

      const res = await axios.post("https://chartink-fyers-trading-bot.onrender.com/api/chartink-alert", payload);

      setStatus(`✅ Order Sent. Qty: ${res.data.qty}, Entry: ₹${res.data.entry}, SL: ₹${res.data.sl}, TP: ₹${res.data.tp}`);
      setResponseJson(res.data); // ✅ Show full JSON
    } catch (err) {
      console.error(err);
      setStatus("❌ Error placing order");
      setResponseJson(err.response?.data || { error: "Unknown error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded-xl shadow-lg w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-1">🚀 Chartink-Fyers Algo Bot</h1>
        <p className="text-sm text-center text-gray-500 mb-4">Test Market/Limit Logic with SL/TP & Risk</p>

        <div className="flex items-center gap-2 mb-4">
          <input type="checkbox" checked={testOnly} onChange={() => setTestOnly(!testOnly)} />
          <label>Test Logic Only (Use Dummy Symbol & Price)</label>
        </div>

        <input type="text" placeholder="Stock Symbol (e.g., TATAMOTORS)" className="w-full p-3 mb-3 border rounded"
          value={symbol} onChange={(e) => setSymbol(e.target.value)} disabled={testOnly} required />

        <input type="number" placeholder="Trigger Price" className="w-full p-3 mb-3 border rounded"
          value={price} onChange={(e) => setPrice(e.target.value)} disabled={testOnly} required />

        <select className="w-full p-3 mb-3 border rounded" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="2">Market</option>
          <option value="1">Limit</option>
        </select>

        <input type="number" placeholder="Capital (₹)" className="w-full p-3 mb-3 border rounded"
          value={capital} onChange={(e) => setCapital(e.target.value)} required />

        <input type="number" step="0.01" placeholder="Buffer % (Instant)" className="w-full p-3 mb-3 border rounded"
          value={bufferInstant} onChange={(e) => setBufferInstant(e.target.value)} />

        <input type="number" step="0.01" placeholder="Buffer % (Limit)" className="w-full p-3 mb-3 border rounded"
          value={bufferLimit} onChange={(e) => setBufferLimit(e.target.value)} />

        <input type="number" step="0.1" placeholder="Risk-Reward Ratio" className="w-full p-3 mb-3 border rounded"
          value={rr} onChange={(e) => setRR(e.target.value)} required />

        <input type="number" step="0.1" placeholder="Risk % per Trade" className="w-full p-3 mb-4 border rounded"
          value={risk} onChange={(e) => setRisk(e.target.value)} required />

        <div className="flex flex-col gap-2 mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enableInstant} onChange={() => setEnableInstant(!enableInstant)} />
            Enable Instant Entry (Market)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enableLimit} onChange={() => setEnableLimit(!enableLimit)} />
            Enable Stop Limit Entry
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enableLockProfit} onChange={() => setEnableLockProfit(!enableLockProfit)} />
            Enable Lock Profit Logic
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
          Submit Order
        </button>

        {status && (
          <p className={`mt-4 text-center text-sm ${status.includes("Error") ? "text-red-600" : "text-green-600"}`}>
            {status}
          </p>
        )}
      </form>

      {responseJson && (
        <div className="bg-gray-800 mt-6 p-4 rounded-xl max-w-3xl mx-auto overflow-auto">
          <h2 className="text-lg font-semibold text-white mb-2">📋 Full Response</h2>
          <pre className="text-sm text-green-200 whitespace-pre-wrap">
            {JSON.stringify(responseJson, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
