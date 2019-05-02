const fixTable = element => {
  const options = {
    freezHeader: true,
    freezColumn: true,
    numColumnsToFreez: 3
  };

  const container = document.querySelector(element);
  const thead = container.querySelector("thead");
  const tbody = container.querySelector("tbody");

  const resetTableLayout = () => {
    const ths = Array.from(thead.querySelectorAll("th"));
    const tbodyTrs = tbody.querySelectorAll("tr");
    const tds = tbody.querySelectorAll("td");

    tbody.setAttribute("style", "");
    thead.style.width = "";
    thead.style.position = "";
    thead.style.top = "";
    thead.style.left = "";
    thead.style.zIndex = "";

    ths.forEach(th => {
      th.style.display = "";
      th.style.position = "";
      th.style.width = "";
      th.style.top = "";
      th.style.left = "";
      th.style.height = "";
    });

    tbodyTrs.forEach(tr => {
      tr.setAttribute("style", "");
    });

    tds.forEach(td => {
      td.style.position = "";
      td.style.width = "";
      td.style.left = "";
      td.style.height = "";
    });

    /**
     * Store width and height of each th
     * getBoundingClientRect()'s dimensions include paddings and borders
     */
    const thStyles = ths.map(th => {
      const rect = th.getBoundingClientRect();
      const style = document.defaultView.getComputedStyle(th, "");
      return {
        boundingWidth: rect.width,
        boundingHeight: rect.height,
        width: parseInt(style.width, 10),
        paddingLeft: parseInt(style.paddingLeft, 10)
      };
    });
    // Set thead and tbody width
    const totalWidth = thStyles.reduce((sum, th) => {
      return sum + th.boundingWidth;
    }, 0);

    const freezedColumnWidth = getSumOfBoundingWidth(
      thStyles,
      0,
      options.numColumnsToFreez
    );

    tbody.style.display = "block";
    tbody.style.width = `${totalWidth}px`;
    thead.style.width = `${totalWidth - freezedColumnWidth}px`;

    // Position thead
    thead.style.position = "absolute";
    thead.style.top = "0";
    thead.style.left = `${freezedColumnWidth}px`;
    thead.style.zIndex = "10";

    const maxThHeight = Math.max.apply(
      Math,
      thStyles.map(th => {
        return th.boundingHeight;
      })
    );
    // Set widths of the th elements in thead. For the fixed th, set its position
    ths.forEach((th, i) => {
      th.style.width = `${thStyles[i].width}px`;
      if (i < options.numColumnsToFreez) {
        th.style.position = "absolute";
        th.style.top = 0;
        th.style.height = `${maxThHeight}px`;
        th.style.left = `-${getSumOfBoundingWidth(
          thStyles,
          i,
          options.numColumnsToFreez
        )}px`;
      }
    });

    // Set margin-top for tbody - the fixed header is displayed in this margin
    tbody.style.marginTop = `${thStyles[0].boundingHeight}px`;

    const borderWidth = parseInt(
      getComputedStyle(tbody.querySelector("td")).borderWidth.slice(0, 1),
      0
    );
    tbodyTrs.forEach((tr, i) => {
      tr.style.display = "block";
      tr.style.paddingLeft = `${freezedColumnWidth}px`;

      const maxTdHeight = Math.max.apply(
        Math,
        Array.from(tr.querySelectorAll("td")).map(td => {
          return td.getBoundingClientRect().height;
        })
      );
      tr.querySelectorAll("td").forEach((td, j) => {
        td.style.width = `${thStyles[j].width}px`;
        if (j < options.numColumnsToFreez) {
          td.style.position = "absolute";
          td.style.height = `${maxTdHeight + borderWidth}px`;
          td.style.left = `${getSumOfBoundingWidth(thStyles, 0, j)}px`;
        }
      });
    });
  };

  const getSumOfBoundingWidth = (arr, start, end) => {
    if (end < 1) return 0;
    return arr.slice(start, end).reduce((sum, val) => {
      return sum + val.boundingWidth;
    }, 0);
  };

  let resizeTimeOut = null;
  const resizeThrottler = () => {
    if (!resizeTimeOut) {
      resizeTimeOut = setTimeout(function() {
        resizeTimeOut = null;
        resetTableLayout();
      }, 500);
    }
  };

  // Update table cell dimensions on resize
  window.addEventListener("resize", resizeThrottler, false);

  container.addEventListener("scroll", function() {
    thead.style.transform = `translate3d(0,${this.scrollTop}px,0)`;
    const transform = `translate3d(${this.scrollLeft}px,0,0)`;
    Array.from(thead.querySelectorAll("th"))
      .slice(0, options.numColumnsToFreez)
      .forEach(th => {
        th.style.transform = transform;
      });
    tbody.querySelectorAll("tr").forEach(tr => {
      Array.from(tr.querySelectorAll("td"))
        .slice(0, options.numColumnsToFreez)
        .forEach(td => {
          td.style.transform = transform;
          td.style.background = "#989898";
        });
    });
  });

  // Initialize table layout
  resetTableLayout();

  return {
    resetTableLayout: resetTableLayout
  };
};
