/** Night gas-station backdrop: canopy sodium wash, wet asphalt, flickering fluoro. */
export function StationAtmosphere() {
  return (
    <div className="station-atmosphere" aria-hidden="true">
      <div className="station-atmosphere__asphalt" />
      <div className="station-atmosphere__noise" />
      <div className="station-atmosphere__canopy" />
      <div className="station-atmosphere__fixtures">
        <span className="station-atmosphere__fixture" />
        <span className="station-atmosphere__fixture" />
        <span className="station-atmosphere__fixture" />
        <span className="station-atmosphere__fixture" />
        <span className="station-atmosphere__fixture" />
        <span className="station-atmosphere__fixture" />
      </div>
      <div className="station-atmosphere__fluoro-housing" />
      <div className="station-atmosphere__fluoro-spill" />
      <div className="station-atmosphere__fluoro" />
      <div className="station-atmosphere__pool station-atmosphere__pool--amber" />
      <div className="station-atmosphere__pool station-atmosphere__pool--cool" />
      <div className="station-atmosphere__pool station-atmosphere__pool--center" />
      <div className="station-atmosphere__vignette" />
    </div>
  );
}
