export default function Candles() {
  return (
    <div className="candles-container">
      {/* Left candle */}
      <div className="candle candle-left">
        <div className="candle-flame">
          <div className="flame-glow" />
          <div className="flame-inner" />
        </div>
        <div className="candle-body">
          <div className="candle-drip" style={{ left: '3px', height: '12px' }} />
          <div className="candle-drip" style={{ right: '2px', height: '18px' }} />
        </div>
      </div>

      {/* Right candle */}
      <div className="candle candle-right">
        <div className="candle-flame">
          <div className="flame-glow" />
          <div className="flame-inner" />
        </div>
        <div className="candle-body">
          <div className="candle-drip" style={{ left: '4px', height: '16px' }} />
          <div className="candle-drip" style={{ right: '3px', height: '10px' }} />
        </div>
      </div>
    </div>
  );
}
