export default function Compass() {
  return (
    <div className="compass">
      <div className="body">
        <div className="panel">
          <div className="hold-bg">
            <div className="glass" />
            <div className="hold-mark">
              <div>
                <span />
                <span />
                <span />
                <span />
              </div>
              <div>
                <span />
                <span />
                <span />
                <span />
              </div>
              <div>
                <span />
                <span />
                <span />
                <span />
              </div>
              <div>
                <span />
                <span />
                <span />
                <span />
              </div>
              <div>
                <span />
                <span />
                <span />
                <span />
              </div>
              <div>
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="hold-arrows">
              <div className="arrow " />
              <div className="arrow  rotate-90" />
              <div className="arrow  rotate-180" />
              <div className="arrow  -rotate-90" />
              <div className="arrow-sub arrow-up-right" />
              <div className="arrow-sub arrow-up-left" />
              <div className="arrow-sub arrow-down-right" />
              <div className="arrow-sub arrow-down-left" />
            </div>
            <div className="hold-directions">
              <div className="direction direction-n">N</div>
              <div className="direction direction-l">L</div>
              <div className="direction direction-s">S</div>
              <div className="direction direction-o">O</div>
              <div className="direction-sub direction-ne">NE</div>
              <div className="direction-sub direction-no">NO</div>
              <div className="direction-sub direction-se">SE</div>
              <div className="direction-sub direction-so">SO</div>
            </div>
          </div>

          <div className="w-full h-full font-bold flex items-center justify-center">
            <div className="center"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
