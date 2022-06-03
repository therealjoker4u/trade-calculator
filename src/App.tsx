import React, { useCallback, useMemo, useState } from 'react';
import './App.css';

function App() {
  const [maxLoss, setMaxLoss] = useState(1)
  const [lossPercentage, setLossPercentage] = useState(0.25)
  const [price, setPrice] = useState(1800)
  const [rr, setRR] = useState(7)
  const [fee, setFee] = useState(0.01)
  const [maxVolDecimals, setMaxVolDecimals] = useState(2)

  const maxPosValue = useMemo(()=>{
    const grossPosValue = (maxLoss * 100) / lossPercentage
    const feeLoss = grossPosValue * ((fee / 100) * 2)
    const netMaxLoss = maxLoss - feeLoss
    const value = (netMaxLoss * 100) / lossPercentage
    return Math.floor(value * 100) / 100
  }, [maxLoss, lossPercentage, fee])

  const maxVol = useMemo(()=>Math.round((maxPosValue / price) * Math.pow(10, maxVolDecimals)) / Math.pow(10, maxVolDecimals), [maxPosValue, price,maxVolDecimals])
  const onCopyMaxVol = useCallback(()=>{
    navigator.clipboard.writeText(maxVol.toString());
  }, [maxVol])

  const reward = useMemo(()=>{
    const grossReward = maxLoss * rr
    const netReward = grossReward - (2 * (maxPosValue * (fee / 100)))
    return Math.floor(netReward * 100) / 100
  }, [maxLoss, rr, fee, maxPosValue])

  const pureRR = useMemo(()=>Math.floor((reward/ maxLoss) * 100) / 100,[reward, maxLoss])

  const netPosValue = useMemo(()=>Math.round(maxVol * price * 100)/100, [maxVol, price])

  return (
    <div className="App">
      <div className="Section">
        <table>
          <tr>
            <td>
              <label htmlFor='max-loss-input'>Max loss amount ($) : </label>
            </td>
            <td>
              <input type="number" step="0.1" min="0.01" defaultValue={maxLoss} id="max-loss-input" onChange={e=>setMaxLoss(parseFloat(e.target.value))}/>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor='loss-percentage-input'>Loss percentage (%) : </label>
            </td>
            <td>
              <input type="number" step="0.01" min="0.01" max="100" defaultValue={lossPercentage} id="loss-percentage-input" onChange={e=>setLossPercentage(parseFloat(e.target.value))}/>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor='rr-input'>Risk/Reward Ratio : </label>
            </td>
            <td>
              <input type="number" step="0.1" min="0.1" defaultValue={rr} id="rr-input" onChange={e=>setRR(parseFloat(e.target.value))}/>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor='price-input'>Coin price : </label>
            </td>
            <td>
              <input type="number" step="1" min="0" defaultValue={price} id="price-input" onChange={e=>setPrice(parseFloat(e.target.value))}/>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor='fee-input'>Exchange Fee (%) : </label>
            </td>
            <td>
              <input type="number" step="0.01" min="0" max="100" defaultValue={fee} id="fee-input" onChange={e=>setFee(parseFloat(e.target.value))}/>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor='fee-input'>Vol Decimals : </label>
            </td>
            <td>
              <input type="number" step="1" min="0" max="8" defaultValue={maxVolDecimals} id="fee-input" onChange={e=>setMaxVolDecimals(parseInt(e.target.value))}/>
            </td>
          </tr>
          <tr>
            <td>
              Max Position value : 
            </td>
            <td>
              $ {maxPosValue}
            </td>
          </tr>
          <tr>
            <td>
              Net Profit : 
            </td>
            <td>
              $ {reward}
            </td>
          </tr>
          <tr>
            <td>
              Pure Risk/Reward ratio : 
            </td>
            <td>
              {pureRR}
            </td>
          </tr>
          <tr>
            <td>
              Max Volume (Quantity) : 
            </td>
            <td>
              {maxVol} <span style={{marginLeft : 30}}>${netPosValue}</span>
            </td>
            <td>
              <button onClick={onCopyMaxVol}>
                Copy Max Quantity
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default App;
