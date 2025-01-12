import { useState } from "react";

export default function Welcome() {
  let [isChecked, setIsChecked] = useState(false);

  return (
    <main>
      <section>Pito</section>
      
			{isChecked && <section>sUPRAIS</section>}

      <button onClick={() => {
				setIsChecked(!isChecked);
				console.log("CLick")}
			}>Click</button>
    </main>
  );
}
