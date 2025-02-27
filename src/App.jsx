import { useState, useEffect } from "react";

function App() {
  const denominations = [
    { name: "1¢", value: 0.01 },
    { name: "5¢", value: 0.05 },
    { name: "10¢", value: 0.1 },
    { name: "25¢", value: 0.25 },
    { name: "50¢", value: 0.5 },
    { name: "$1", value: 1 },
    { name: "$5", value: 5 },
    { name: "$10", value: 10 },
    { name: "$20", value: 20 },
    { name: "$50", value: 50 },
    { name: "$100", value: 100 },
  ];

  const [counts, setCounts] = useState(
    denominations.reduce((acc, denom) => {
      acc[denom.value] = 0;
      return acc;
    }, {})
  );

  const [cashReport, setCashReport] = useState("");

  const handleChange = (value, amount) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [value]: amount,
    }));
  };

  const calculateTotal = () => {
    return Object.entries(counts).reduce(
      (total, [value, amount]) => total + parseFloat(value) * amount,
      0
    );
  };

  let totalAmount = calculateTotal();
  let remainingAmount = totalAmount;
  let depositAmount = 0;
  let tempCounts = { ...counts };
  let keptDenominations = { ...counts };
  let depositDenominations = {};

  if (totalAmount > 250) {
    for (let denom of denominations.slice().reverse()) {
      while (remainingAmount > 250 && tempCounts[denom.value] > 0) {
        if (remainingAmount - denom.value >= 250) {
          remainingAmount -= denom.value;
          depositAmount += denom.value;
          tempCounts[denom.value] -= 1;

          if (!depositDenominations[denom.value]) {
            depositDenominations[denom.value] = 1;
          } else {
            depositDenominations[denom.value] += 1;
          }
        } else {
          break;
        }
      }
    }
    keptDenominations = { ...tempCounts };
  }

  const printReport = () => {
    window.print();
  };

  const clearData = () => {
    setCounts(
      denominations.reduce((acc, denom) => {
        acc[denom.value] = 0;
        return acc;
      }, {})
    );
    setCashReport("");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial" }}>
      {/* Header */}
      <h2 style={{ marginBottom: "10px" }}>Cashier Report</h2>

      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <h3>Cashier: _______________ Date: ____/____/____</h3>
        <h3>Supervisor: _______________ Date: ____/____/____</h3>
      </div>

      {/* Table for entering cash counts */}
      <table border="1" style={{ margin: "auto", width: "80%", fontSize: "14px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Denomination</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {denominations.map((denom) => (
            <tr key={denom.value}>
              <td>{denom.name}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={counts[denom.value]}
                  onChange={(e) => handleChange(denom.value, Number(e.target.value))}
                  style={{ width: "60px", textAlign: "center" }}
                />
              </td>
              <td>${(counts[denom.value] * denom.value).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ marginTop: "15px", fontSize: "14px", fontWeight: "bold", textAlign: "center" }}>
        <p>Total: <span style={{ color: "black" }}>${totalAmount.toFixed(2)}</span></p>
        <p>Amount to Keep in Register: <span style={{ color: "black" }}>${remainingAmount.toFixed(2)}</span></p>
        <p>Amount to Deposit: <span style={{ color: "black" }}>${depositAmount.toFixed(2)}</span></p>
      </div>

      {/* Additional Information */}
      <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "20px" }}>
        <div>
          <h4>Denominations Kept in Register</h4>
          <table border="1" style={{ width: "250px", fontSize: "12px", borderCollapse: "collapse" }}>
            <tbody>
              {denominations.map((denom) => (
                <tr key={denom.value}>
                  <td>{denom.name}</td>
                  <td>{keptDenominations[denom.value]}</td>
                  <td>${(keptDenominations[denom.value] * denom.value).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h4>Denominations Sent to Deposit</h4>
          <table border="1" style={{ width: "250px", fontSize: "12px", borderCollapse: "collapse" }}>
            <tbody>
              {denominations.map((denom) => (
                <tr key={denom.value}>
                  <td>{denom.name}</td>
                  <td>{depositDenominations[denom.value] || 0}</td>
                  <td>${((depositDenominations[denom.value] || 0) * denom.value).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={printReport}
          style={{
            backgroundColor: "#2a9d8f",
            color: "white",
            border: "none",
            padding: "10px 15px",
            marginRight: "10px",
            cursor: "pointer",
            borderRadius: "5px"
          }}
        >
          Print Report 🖨️
        </button>

        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to clear all data?")) {
              clearData();
            }
          }}
          style={{
            backgroundColor: "#e76f51",
            color: "white",
            border: "none",
            padding: "10px 15px",
            cursor: "pointer",
            borderRadius: "5px"
          }}
        >
          Clear Data 🗑️
        </button>
      </div>
    </div>
  );
}

export default App;
