import { useStore } from "../../../store";

function add(accumulator: number, a: number) {
  return accumulator + a;
}

export default function Hint() {
  const store = useStore();

  const hint = store.hint?.replace(/[\s\S]{1,30}(?!\S)/g, "$&\n") ?? "";
  const box =
    "M 387 189.5 H 98.46 A 8,8 0 0 1 92,176.7 l 33.55,-42.08 A 8,8 0 0 1 132,131.4 h 285.84 a 8,8 0 0 1 6.49,12.7 l -30.82,42.08 A 8,8 0 0 1 387,189.5 Z";
  return (
    <div className="flex justify-center items-start cursor-pointer">
      <svg
        className="border"
        width="100%"
        height={500}
        onClick={() => store.setHint("")}
        viewBox="0 0 376.9122 300"
        version="1.1"
        id="svg241"
      >
        <defs id="defs206">
          <clipPath id="clip-path">
            <path
              className="cls-1"
              d="M 433.07,128 H 303.25 a 0.86,0.86 0 0 1 -0.57,-1.5 l 18,-16.13 a 0.89,0.89 0 0 1 0.58,-0.22 h 124 a 0.86,0.86 0 0 1 0.68,1.38 l -12.19,16.13 a 0.88,0.88 0 0 1 -0.68,0.34 z"
              id="path200"
            />
          </clipPath>
          <clipPath id="clip-path-2">
            <rect
              className="cls-1"
              x="297.38"
              y="105.15"
              width="153.75"
              height="27.85"
              id="rect203"
            />
          </clipPath>
        </defs>
        <g
          id="Layer_6"
          data-name="Layer 6"
          transform="translate(-70,-102.53562)"
        >
          <path className="cls-2" d={box} id="path210" />

          <g transform="translate(124.46, 158.77)">
            <text
              x={0}
              y={0}
              fontStyle="italic"
              className="cls-11"
              fontWeight="bold"
              stroke="#000"
              strokeWidth={0.5}
              fill="#fff"
            >
              {hint &&
                hint.split("\n").map((i, idx) => (
                  <tspan key={i} x={0} dx={idx && -5} dy={idx && `0.9em`}>
                    {i}
                  </tspan>
                ))}
            </text>
          </g>

          <g className="cls-3" id="g220">
            <g className="cls-4" clipPath="url(#clip-path)" id="g218">
              <g className="cls-5" clipPath="url(#clip-path-2)" id="g216">
                <g className="cls-5" clipPath="url(#clip-path-2)" id="g214">
                  <image
                    width={321}
                    height={59}
                    transform="matrix(0.48,0,0,0.48,297.24,105.12)"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUEAAAA7CAYAAADlwDgiAAAACXBIWXMAABcRAAAXEQHKJvM/AAAYXklEQVR4Xu1d4XYdt40GlOTsPsv2Ry3LeZ40dmw3p32Xtolbu2n8RGnSJ9lzNlvHlmxJ7A8OSQAECJAzV1bP6WfPHQ4JgiAIfkPOXEmYUkrwb4a3l+8BAOCXd++BmZ8SJJneyq10TqaqJ5/TVkzPep5WP6VU21fTxLZWN+tNXV5ru88jsilBUuRZm/QAI9+qA055VI953AZkxvWHvjEOq4zlT/RdG8eWXw57LK0YYu3KWNry6HXRQ+0p6daunm51ocZV/s/PXB+vz3QYaa+cgZYb+S0r5z159jUkAHh48TmcXzzq5AowqS3eT3y4voGf31zaDivBYKWL81laDLASQGVwSz0tYLp0UoK11tfqtmBMTCaRa1DyNDkiK+SSVlfKjPJhUBbVYRAepAS3AZ2qfhjrdet75UG/0TFtefRaG3O9PqRUY4jbooytEVsArc2Sbu3SNK3TztmGBPk/P0t9OZXrMB1Mb5VSy2WagbYh8ngWz0uQCfHJs687WQCAMzX3HuLnN5fw85vLoYzhugZETwIAAeogbVmd3oAaWkdNd7YgSMWauZEuZCTI4ZpqmmTXS0ud2QypG4EuqmuPqEVx1Ey1FCNDZQLLh6EkYi+AOk9VoBjcYLVDINsWpX2yO694mtahbazoyrB89vq7l/D750/gHz/+vSu79yT44foW/vfnt3B9c1vz6IBZ6T1IAAMWuBsc1BVQKKNejprwJmB0YgOAIOIxi2o2KT1w0NqZMLNDgq2fe5RMwPNp2AwE4NLhmgLFf6R+aucE0Iwm+e2URyw5EypsXXRVYEyen378AX73/HFHhPeaBD9c38L//5JXf16ASEyKA4BRJz7zTo55YhQrIcIk06oU2GPSE55Pfw0oDhed4lYb5zRNYU0j8UnnjIh3GixpJJ89LHLcaCvcqaSkRrCl1Cbjhkzjd88fs+t7S4LXN40AV+CuChHlzSuOWUY+AKP+2EViO5zaIZ9DrWI8kecDed2arW+CgLvHAX0tH0hJVFL06Uh2FYl8xsHtzzGl9Km6AeuZiW4XfU1vPo6LK7x5HcTvnz+p6XtJgpkAr4B65qC+HwNizGyorQABl8nKvMtuh3uzcNBXl6RwFwSR1OQgawr8ZtET7YhkAaSPmj8013cP9SPjTvVg1a7LmpDt8rwkE2QbrFk4thpJuTCeiQX7sMnN2PHTjz/A6+9eAgDAp4bMR8O7q2t4d/XBE5sDYhu0itEwYSsXYjk29GdNw4BVbdAhRROkTIRL0xm72CrKSS/vBMUMr81xuSQeRZpkRdtUgXxFEyIkBbxas3lRnQIZHdvI1gHmIx1p1w7XQGUDkXbvEuXZ4L1aCf7z7XuFAAd3il0I6vLEoiMblQNNdDPCUjFQnb/OQI4gvG4DxG/UHwWJndbQPTJoq7iWpoeOmZWgXJm7b4zVZqUUvyY7WZoLPbCTrZpqAZfvMREkavWJ+hSBej/9+AMA3CMS/Ofb99sbYN94gD44wqj1/OlR1gHWp4sJ0qHotdt6sH4MyikIIdYJrti5Zvk9Q4JQRwIi0JSlet2/9d6P6e1wlOxZIGjS0bw5DHcvwWkUwaqlr797eT9IsBEgR5Tn1r4mg+Ks5QBA0hxMckbt0TKM02eqHwVOLSMCIm0BQNzR9wIIEz07rmuKj6Oq+X2mKfL4LQQkp2qQZxkvR+9OCuu2sgcKLGm159l+PD46Cb5590EhwGMcESfEAdCxZhQd7MGeF0VKuTJx5KJDExlkdTjERwfDtyjSszgBhsSEUKjOBkRqS2OtqH0R8BtnzD8lJO3Q7A1cihelCl8h6kQ5gyW74COvBK9vbuH/3lwNtsA0b62DHpCd+VU9qwFC72O6bQhQozxm/UhqbQby78jph8vNBhZjzkVMLe3Dfngu0Ppq1dG2f7Zsd09bBNcQ1eePYdPky/rY9/M7DauEZ+GjkOD1zS28eTd6ATIClYvWWXFcf6fSNURDLo7aDuaJ3rVLmmRlwhTvJzX4CqXH8T3zMUcMY6kowbuREdSTYUdJoinLuFCcyrr8u3oIGOhUBDuViOrq88FIEyGfKAjWu3MSvL5J8MvltVGKwm7eCdkn/sgt1mEPWM/z+miNBBCfhQK1VnmBMRSyIH9aohwxeNILL5zDiFnpNxwJiYCIKoT1UxYmKK9MNLhWLzlUtpcCDQHUXgzmHM+TZwNG8TI5L/kkhifPvr5bEswEWFaAMW/IZynyIe5R5LcOvX3PKlo+7MOgjJdgPQr9jeC5bSbsMhnSNZx2xBGTRnLoOGLuWNpzr7S+lTEglwIJYDgAvtlG3URPvpb9KHMS6WUIowidUOMiwg93RoK/XF4TAhzBN9rrl/e2eFR9LnTkUArNnqEbzK9BBOtnbBMysAiYUhtA3lZTUtIb8OyiiJloE6y31S/wbEoRoQLSYLRKB/RvYCYoFwU6z3+91YkhzFn74n+D1jurxyMivLOV4Nura7i51TqdjRttc7VrC1pn3e9ZGbBrBY1x4NmVikwJVOht6lUg+VyHTWMcY6LRCTE6Ggn0PnMJGzNbdU8sj4UjBLAJNUGLQJ1bp2uPLiHb9bVEVkkj7KlufXXmVEDsf0T04cXnAHAHK8G3V9dwfVMGROs4slPNFeX5uglFBzAqtwYn0Pw4HCJ32bC/8gsnG8TdzYYRIxpXQIVOoULCGdvo2HtSI7JnvUNusbgEgMCDCsehwy6tuXoZ/tiD7lzP4TGRJdU0JsovWT0pCb69uiEEyMGNRZEpr7fLOullvtf1jJjUDHSNNNdKRxCJMYkEfjte8I5XYD3YSxJWUdcS0Z2UoxdKjaG0AwCAUSmKa99XAJq/lFrBGKwgnfL8wX/r8kCQTptZezqgeUZ2htYBryN7TaLAYoWTpwAR2a/cPwkJ3twmeHt102+BsX6QawFZLOpEx1YlxmhlAJ8pLCQeCyy9ojOwbZYZXiueGzhNxKGtfDRtK7oZEKAxSOI+2q5RXG8X5NiDUh/bVX8HUG8K/rOwqHdsPV0Jjtefa4sIrx9ziFlA4K2YB2XnF4/gxV9f1+vDSdAkwAJpHZbTgByNHqkvPUYDukJCDNh9lvxqP5a+YPnfpIhtMh19OZLsRMZ0NB0Dv1ms/yJAcgAI/Qm4X2R68yfzqcF/0YjQh4dkYv2YhhfurHum1OkR9RVAmQOLiKzo0PeElf/kKf9bI4eSYCFAC9UoSVQoysnVDldWRO90AOAQJS2z0uSaZQsyY1ucNGejAFtdaE0ThJuh20rnQNx+P5w7SxQWMiA5KwFUF1YNxQaJ0RgKQom4w2pGSAVywCEHoyzmsgrXVIHQDqWuriOy/FLt8ygrYk8QspkXr153f3nuMBI0CdCMHuEaKTY7khH4kezI0DI9bdf2N0IatAClhDALuXtUZWBrN3jUr1rUj6KEaVzqP0VKRH3phGbTCMSu3M+RcEZEJiYUI8qQKkh9XVqPpUMKqz41tMq8qKr0AOwIz7JphMAqTyIya88vHql/evMQEry5TfDuff9bYAAG3IZKKer3yagjfGyjMBztUoa+jIIcb8f0Yry1t4s8RO4FAKAP3uCoehPJrxWPQVuAYnhyq9jIMOqLPU3F7lpeucQmX0NaziWaHuv2diFqqXQIvWRt8/RsL2cw0n1+8QhevGrPASl2k+C797cmAVZYTj6lR1TM2GFH/Wg+sICiJCACwAs8AIC8Te7zsRIMkqMU9vISkQld21Wa0EC7CghsxZWzy/NAqixgLEHnC7EtX0HEFwUj2eQK6GUtexhVg7KCASl5nTTKWauWjoFqz2pWvo2fVicyVypkTGyHfA5IsYsE372/ZS9ApozdsFIniqY6ifMIERkBEiDKT3GKT5pPrs1AHflnwdagu6O7y4JOTBCnQQFqroUZe2ZwmM5RLKOxy6mZrdSdEkF7icZxlVGDQecwFUoVr0se9nzb49tX36vb4IJlEpQE6GJgsCxRJb0lu1oec1IFbh9Ota54om8ziI1xgp56W0ks00bMhhkkmDZCoJuXBjuObrDlJwh2LCKnoY6RkhnjnZBQxam6uDLtaPFC9SFk3fOLR3D+0CZAgEUSvPyQTAJUv7biXJsgupjjwlFbbIzKA0SCq5dQSIgbzLOC9ufJ4NuTEZXLiEy0oJkxJPGVlWVspF/0DXSmpI1LY72so6tmQvcH1qP71fjswmvIK/eiWMTYnQOrf3ob/L5JhL/+NgjS84tH8O3L783ygikSvLkF+OVqWwEeOkN67NE+2mJ45xHs95ujLz60EjMU0Bp0RRYC8+kgzGw/Xfdh+dlNenwEbJ0qhBUZdxu8cuTmHF0NauCk2pJ+qzuAso/lXPLHrdPSLi0XBwHMEOHjp79V8yXCJHhzC3D5wXkB4mEQJDOOmEe749vnYCQaoLX3aZLog5C7MRMKIqpOHBHvkfD63Dfn1YjB03JkN/sQSeBb4COP57qlc6G73o6FAPc3TAhHbioWvn31vbsNLgiRoEmAhpER432JoMywLT86+jsbLeyzdNjt+BboaOZ4GvJE7H5CYoRNd1B6cpLpyFvTyI+NWSj1Gukjyu+a8juEN3yBMGVo8iiODOmnJo7DxtpjD6JAukleG/qoDUeM26oSq7s020pTTG2Lt+PhxedhAgQIkOBNOmAFCCIgZJ5xfQTKXbaRHT9XaGNN8xBA2/SuhchpELn5UHjSJK72IaWNsOI/NtcDgRJF3tVulFoMjOzfSYc8UYoSR5bXND9V9aGGbN21eAeGJoTs24Odxk/g/OEj+Obl3zwxhiEJfrhJmQBHfTBmSHRCdkQYrKehrzqha0KUAsmnriMWYN6N/1AElafCOWKRIuFMXxVBEwRIS/RkTGI1VxBlfP5zEj4eTS+SD3rTqCkR6PSykbU5NedwiJIYrLkfXg0CwJdPn6v5I5gkeHmd4D39NVgi0ldcs1KHYg9Buti6WoIOAW2DSX4in3FotXwdp+y+REdsg7ZNywnhJGjnfVvi7ah6bRzprvaoQdcaJ1MdbBtLUoldKcLism2tef7u2KkKZhRFZCMyMSL85uXfprbBBSoJXl7bX4FRbd7tYRv7iC+J8yRoNSNN77wR5KpIPo/BXelC41A9XMZuO+lfJJ8BbRHIeYDBfn5QZMAWtvRoxKX1247zKQNNjEhaLdrL6gT9HGnpOf/bePz0t0sECKCQ4JAACzTDA0wNYFWd9wSto1VfULkE687bwA3Jdm3yvbCBuOTJkPKRkjGJlTz5LJD+24/ti84DXXlokjowdnxgd5SXMEchrmmVGL1yHWzJsKu/8bp5aOLyEogI5w8fwZdfzW+DCxgJXl0nuI2+A1m328VxARfQcwi/jNoRq5+l9sb9QICdQdtgTjskhyHTwbBJ3eItoPkybFGFwY1Q2Z4c5c376O27VTRvmeI291pmzJD+qTEmcmnXytyffREiUUnww03+KgwArN+pg6vBU6Jfep8WtHv7u2pNMnvyeQSolswQ2YZKGvTwhAt5iH9DIDnC2EOlFKge9es4hp/LzcGFwZShuhUR4YjMKYBOX/bZpfn/m7/sI0CAjQRvU34TTBEhwrnBW8c8kSZxHsBRbfsh69a3wwPSkuo09V2ezVq5eX1ZY3Yt4JYQLD2UFQJDx9RESHZD8yVhzclYSYHG7VVjK9fQD+OcbSoWVaztQPbAJsR+9Qew0rEvv3oODx5eeGIuzgDyKnAV86avkNoa7qqdHhPtJiXZBWwySaHxwESbs9g4BgnXVFDeoDPtFLMOyQGiCYRsoGjXs6InUq2Tx+FIzV7fMnKLPdFY6RV49a1yPX80b0vZ3ueAFGe3CexfhuB2LoNJBSZj5CcbjiSwYT98UwjGwpbJ+l8L2xJHdTPg072oLUiuqGmsy6a6hRT/NKC2n9RE9YUaLxNQWyztIZJVXjIPzTypLoTUPwxYXQVJ2KN/+riYw/6+IiL86S/feWJhnN04L0KiRHj3CAyuECl9QcBQ9QgiEyAiw7DJMxNHOrxZqsHov5pNMtXngoyACrn0zwKt54Hqb4MJjI9BqdsJG7lK35Bnllm0sLh+9PcXnqHdfyzynRwlH8hOpgB9bJNhpfeCWtLSs+E5WgT96c/HESBA4MfmABp5GIX0dIcYssKgrAEB85yl5OjUkNB3gElMDE9vRrGnXQcxuQoM66UoRIcAyeKLIkjs8XyKlKwm0fW62oJQV12F7CghymMafh11RMxxIv5yVFu7KI/Syoqz6W8NScLxe7chLAjAhXs7tBWx9jLqqOeAFGd7ngdKRH2yZ6vbqs5N/A5Fz4Iaan4kTaEFoQVpmmZq411JPjpqrPnNNzl6wKAq63++8N4Gsz/otBeJHACNCLe0hT0tWzyq+SgS954bzDfUJDFqxdO/DL9ru/Hg4QX85skzT2waoZUgALh39ILI4EeeCa4hZuM6st2x1R+VSSRdU6qsB7XWxKomgT8RPBOH1Tc7igxdZVvPB9c84Y321i71i9Fxz2u6WzPbzvD32p9Q4Djd3FmBYXe8Owz2wiGvCI/eBheESRAgToSyN6cauMjKawW8n4rtarv6VqNB8wEnzuGqabSSUWbiXo+n7VgiwgqEBAlwO2vPBxGW50zABoX8FD+O9NhxlS0P3nsAsN/aARRz/J4U6CtBHjne6nsFCNA6Wm0ItDPwnz5f9Ap//PNf1fwjcPbJFA3GiFBKdM8cQlFzGkSe/9Ug8sfGAA+O3N3SLivhTSCOyWwr0+n07hFrEwnhkX9bDMR0TALJAQBspazE3mho9ZVeIkcQKamLARobGri5ch6BCs4tWiw6kGRXzsX+2o+Isjlo9v3myTN4cH7sc0CKs7Pj+7GEeWK0GUq7MknPbXYgYJrgKlWRJ8mo7preFVS+CHZ/jCxZyDBBJgTtwfcuOPZqKOJpQGy9iQgrjdkrQSpTU1IUpG207mgGUIQ2ZZLsklhb0n7MuaCDNvzUT6d6DkgxuQ7MiKwG7xvk2Ee3DJ5cSIspJO7Sil81T5verxFuW1XIzZsMZQU0kgv1vSKTBvWn94eSRmAkrfJRJrS29daPUopMkZBJJd1j5lGPvRKkMp2IiY5A6vV4/EWOJiZEkJ9NOafYMFhbDRfZP7443Ta44OyzTwBc6xV8PCKMtqvLmeGBOuEhIFdlNW8ozuOLLc3KFGWoJbfJib0OBgSAbUrbk7ZNtMiEG8V9dCQ4tr7Aav2MCEkX+O1IotRq9HmZiH3tI9j2J6N8FGgetLpK3oD0Au7OCNkzximfA1KcAQBkIpzHxyPCAhxO0llo/fFWgjEMdJR4Kwmy6Gi1WkZk0nsrAXp4OG4l2FDJI2qEhyhRAEAjYX5wK3j9WaKzpGf1AGju0XXwccLyX2C+fYn9GnTIfp76OSDFGQDA7MsRCpU4YjOVwatDnTSOJW+Y7HaOIbwNVNVIbeW3WNtz8yim0wUhZq1oFnV3WSrPdaqicqhKFC1TtzGxY9BFaL9GS9Qp+aLiSE88X6EwRLC0dyTemwVro8XhahBmdzupAcpN4sH5BXzx+KkjfRzOAADOEOC/PwtaugCP4I7BQfajOKuFLU0/NakG7gN582DXSKexOssJvJcLo+ntA8vHge49SBXZDss+9n1OLBUhkuMxtxLMNtKp478424BYY2gGc/YZ6G4IXuzxNh+cX8AfXrwyZE+DugY8Q4DPPjnACdA78xDnKgQUQxLnOwJKi1FNZznRH3YXj9mNdUmUD/6gH2GVDBMAX7kpamJac8XuX/TBngDfTRf/rROcV+4i0AVrMaDvclApC1op2wlWm0I3HVHNn3lk9uvzC/jixG+CNXxKL8pLEvm7BWdxNyu/gjLBGxL5HKKvOofFuv7dkZpGUijjGwExBTgkQYnOlG4D8g2VXmQsp1YeU0cVtJ61qznM9CGCQ9QtKEEsv6BBVu6V0XlF4wMBIGECSCXfH5USS7n9BcMHQODfAmBlRnu/Pr+AP3z7UqlxejASBMhE+MkZbr9p+ljnzEA66pCBKrFRziOVtEzI1UHO0Qdq2CV6LYIiEekDuqWBqyXtbc+VUnBsE00oPqPu9OE5PYqshz+rGyMi5cp4CpbgtlrR3wRVKQBkwRcan3UypNqFgUF1Xzx+eqfPACU6EgTIW+P/+hTgNiHc3JbfOr1+315z7hj9oCVx7nOSzIhEh4Qhn7OJj6pu2UgfpBIt2FcMDCIY9MdacJS27cazuTvQDQCItR6RGSI0rvq1i5FsIgkhN9NEHJz8+rVfK9dKH5w/zNvfx1/BxwamyEzYkH8Bq1bCVfQavfKIjFXe8uW2wr+WOo2yBG0QB+l6xdIJ2klL9222vFRlS5ZdxutaZ0jNLnmuWjwZcf7Vr/4H/oP/4N8V/wLyFM6+BSgCEgAAAABJRU5ErkJggg=="
                    id="image212"
                  />
                </g>
              </g>
            </g>
          </g>
          <text
            className="cls-6"
            transform="translate(401.46,121.77)"
            id="text226"
          >
            hints
          </text>
          <text
            className="cls-8"
            transform="translate(402.46,120.77)"
            id="text232"
          >
            hints
          </text>
          <path className="cls-9" d={box} id="path234" />
          <line
            className="cls-10"
            x1={70}
            y1="192.5"
            x2={266}
            y2="192.5"
            id="line236"
          />
          <line
            className="cls-10"
            x1="207.5"
            y1="128.5"
            x2="444.5"
            y2="128.5"
            id="line238"
          />
        </g>
      </svg>
    </div>
  );
}
