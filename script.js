document.addEventListener('DOMContentLoaded', function() {
  // T、N、M 的選項內容
  const tOptions = ['Tis', 'T1mi', 'T1a', 'T1b', 'T1c', 'T2a', 'T2b', 'T3', 'T4'];
  const nOptions = ['N0', 'N1', 'N2a', 'N2b', 'N3'];
  const mOptions = ['M0', 'M1a', 'M1b', 'M1c1', 'M1c2'];

  // 填充下拉選單
  function populateDropdowns() {
    const tSelect = document.getElementById('t-stage');
    const nSelect = document.getElementById('n-stage');
    const mSelect = document.getElementById('m-stage');

    tOptions.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      tSelect.appendChild(opt);
    });

    nOptions.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      nSelect.appendChild(opt);
    });

    mOptions.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      mSelect.appendChild(opt);
    });
  }

  // 計算分期
  function calculateStage() {
    const t = document.getElementById('t-stage').value;
    const n = document.getElementById('n-stage').value;
    const m = document.getElementById('m-stage').value;
    const errorMessage = document.getElementById('error-message');
    
    if (t && n && m) {
      const stage = determineStage(t, n, m);
      document.getElementById('final-stage').textContent = stage;
      errorMessage.textContent = stage === '無法判定' ? 
        '無法根據當前的 TNM 組合判定期別，請檢查輸入是否正確。' : '';
    } else {
      document.getElementById('final-stage').textContent = '--';
      errorMessage.textContent = '';
    }
  }

  // 分期判斷函數
  function determineStage(t, n, m) {
    // 如果有 M1 系列，直接判斷為 Stage IV
    if (m.startsWith('M1')) {
      if (m === 'M1a' || m === 'M1b') {
        return 'IVA';
      } else if (m === 'M1c1' || m === 'M1c2') {
        return 'IVB';
      }
    }

    // 其他情況按照表格判斷
    if (t === 'Tis' && n === 'N0') {
      return '0';
    }

    if ((t === 'T1mi' || t === 'T1a') && n === 'N0') {
      return 'IA1';
    }

    if (t === 'T1b' && n === 'N0') {
      return 'IA2';
    }

    if (t === 'T1c' && n === 'N0') {
      return 'IA3';
    }

    if (t === 'T2a' && n === 'N0') {
      return 'IB';
    }

    if (t === 'T2b' && n === 'N0') {
      return 'IIA';
    }

    if ((t === 'T1mi' || t === 'T1a' || t === 'T1b' || t === 'T1c') && n === 'N1') {
      return 'IIA';
    }

    if (t === 'T3' && n === 'N0') {
      return 'IIB';
    }

    if ((t === 'T1mi' || t === 'T1a' || t === 'T1b' || t === 'T1c') && n === 'N2a') {
      return 'IIB';
    }

    if ((t === 'T2a' || t === 'T2b') && n === 'N1') {
      return 'IIB';
    }

    if (t === 'T4' && n === 'N0') {
      return 'IIIA';
    }

    if ((t === 'T3' || t === 'T4') && n === 'N1') {
      return 'IIIA';
    }

    if ((t === 'T1mi' || t === 'T1a' || t === 'T1b' || t === 'T1c') && n === 'N2b') {
      return 'IIIA';
    }

    if ((t === 'T2a' || t === 'T2b' || t === 'T3') && (n === 'N2a')) {
      return 'IIIA';
    }

    if ((t === 'T2a' || t === 'T2b' || t === 'T3') && n === 'N2b') {
      return 'IIIB';
    }

    if (t === 'T4' && (n === 'N2a' || n === 'N2b')) {
      return 'IIIB';
    }

    if ((t === 'T1mi' || t === 'T1a' || t === 'T1b' || t === 'T1c' || t === 'T2a' || t === 'T2b') && n === 'N3') {
      return 'IIIB';
    }

    if ((t === 'T3' || t === 'T4') && n === 'N3') {
      return 'IIIC';
    }

    return '無法判定';
  }

  // 添加事件監聽器
  document.getElementById('t-stage').addEventListener('change', calculateStage);
  document.getElementById('n-stage').addEventListener('change', calculateStage);
  document.getElementById('m-stage').addEventListener('change', calculateStage);

  // 初始化下拉選單
  populateDropdowns();

  // 添加顯示診斷按鈕的事件監聽器
  document.getElementById('show-diagnosis').addEventListener('click', function() {
    const histology = document.getElementById('histology').value;
    const pathDate = document.getElementById('path-date').value;
    const specimen = document.getElementById('specimen').value;
    const location = document.getElementById('tumor-location').value;
    const stageType = document.getElementById('stage-type').value;
    const t = document.getElementById('t-stage').value;
    const n = document.getElementById('n-stage').value;
    const m = document.getElementById('m-stage').value;
    const stage = document.getElementById('final-stage').textContent;

    // 生成診斷文字的各個部分
    let diagnosisParts = ['Lung cancer'];

    // 添加病理細胞種類
    if (histology) {
      diagnosisParts.push(histology);
    }

    // 添加日期和取得方式
    if (pathDate || specimen) {
      let dateSpecimen = [];
      if (pathDate) {
        const formattedDate = new Date(pathDate).toLocaleDateString('zh-TW');
        dateSpecimen.push(formattedDate);
      }
      if (specimen) {
        dateSpecimen.push(specimen);
      }
      if (dateSpecimen.length > 0) {
        diagnosisParts.push(`(${dateSpecimen.join(' ')})`);
      }
    }

    // 添加腫瘤部位
    if (location) {
      diagnosisParts.push(location);
    }

    // 添加 TNM 分期（包含分期類別）
    if (t || n || m) {
      let tnm = stageType;
      tnm += t || 'Tx';
      tnm += n || 'Nx';
      tnm += m || 'Mx';
      diagnosisParts.push(tnm);
    }

    // 添加 Stage
    if (stage && stage !== '--' && stage !== '無法判定') {
      diagnosisParts.push(`Stage `);
      const stageSpan = document.createElement('span');
      stageSpan.textContent = stage;
      stageSpan.style.fontSize = '24px';
      stageSpan.style.fontWeight = 'bold';
      diagnosisParts.push(stageSpan);
    }

    // 組合診斷文字
    const diagnosis = document.createElement('div');
    diagnosisParts.forEach((part, index) => {
      if (part instanceof Element) {
        diagnosis.appendChild(part);
      } else {
        diagnosis.appendChild(document.createTextNode(index === 0 ? part : `, ${part}`));
      }
    });
    diagnosis.appendChild(document.createTextNode('.'));
    
    // 顯示診斷結果
    const diagnosisContainer = document.getElementById('full-diagnosis-container');
    const diagnosisDiv = document.getElementById('full-diagnosis');
    diagnosisDiv.innerHTML = '';
    diagnosisDiv.appendChild(diagnosis);
    diagnosisContainer.style.display = 'block';
    document.getElementById('error-message').textContent = '';
  });

  // 添加複製按鈕的事件監聽器
  document.getElementById('copy-diagnosis').addEventListener('click', function() {
    const diagnosisText = document.getElementById('full-diagnosis').textContent;
    navigator.clipboard.writeText(diagnosisText).then(() => {
      const copyButton = document.getElementById('copy-diagnosis');
      const originalText = copyButton.textContent;
      copyButton.textContent = '已複製！';
      copyButton.style.backgroundColor = '#28a745';  // 變成綠色
      
      // 2秒後恢復原狀
      setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.style.backgroundColor = '#444';
      }, 2000);
    }).catch(err => {
      console.error('複製失敗：', err);
      document.getElementById('error-message').textContent = '複製失敗，請手動複製文字';
    });
  });

  // 當任何輸入改變時隱藏診斷結果
  const inputs = ['histology', 't-stage', 'n-stage', 'm-stage', 'tumor-location', 'path-date', 'specimen', 'stage-type'];
  inputs.forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
      document.getElementById('full-diagnosis-container').style.display = 'none';
      document.getElementById('error-message').textContent = '';
    });
  });

  // 為所有說明按鈕添加事件監聽器
  document.querySelectorAll('.help-button').forEach(button => {
    button.addEventListener('click', function() {
      const type = this.getAttribute('data-type');
      showHelp(type);
    });
  });

  // 為關閉按鈕添加事件監聽器
  document.getElementById('close-help').addEventListener('click', closeHelp);

  // 點擊遮罩層關閉說明視窗
  document.getElementById('modal-overlay').addEventListener('click', closeHelp);

  // 顯示說明函數
  function showHelp(type) {
    const helpContent = {
      't': `
        <h3>T分期說明</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 15%;">T 分類</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">標準</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">TX</td>
            <td style="border: 1px solid #ddd; padding: 8px;">無法評估原發腫瘤<br>包括透過痰液或支氣管沖洗發現惡性細胞，但無法透過影像或支氣管鏡檢視的腫瘤</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">T0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">無原發腫瘤的證據</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Tis</td>
            <td style="border: 1px solid #ddd; padding: 8px;">原位癌<br>鱗狀細胞原位癌 (SCIS)<br>原位腺癌 (AIS)：具有純鱗狀生長模式，最大直徑 ≤ 3 cm</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">T1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤最大直徑 ≤ 3 cm，周圍被肺或臟層胸膜包圍，或位於葉支氣管或更外側的支氣管內</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">T1mi</td>
            <td style="border: 1px solid #ddd; padding: 8px;">微浸潤性腺癌：腺癌 (最大直徑 ≤ 3 cm)，以鱗狀生長為主，且浸潤部分最大直徑 ≤ 5 mm</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">T1a</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤最大直徑 ≤ 1 cm<br>或侵襲性成分僅限於支氣管壁，可能延伸至主支氣管，這是一種罕見的表淺擴散型腫瘤</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">T1b</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤最大直徑 > 1 cm 但 ≤ 2 cm</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">T1c</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤最大直徑 > 2 cm 但 ≤ 3 cm</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">T2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤最大直徑 > 3 cm 但 ≤ 5 cm<br>或腫瘤最大直徑 ≤ 4 cm，且具有以下一項或多項特徵：<br>- 侵犯臟層胸膜<br>- 侵犯鄰近肺葉<br>- 侵犯主支氣管 (但不涉及隆突)<br>- 伴隨肺不張或阻塞性肺炎，擴展至肺門區，影響部分或整個肺葉</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">T2a</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤最大直徑 > 3 cm 但 ≤ 4 cm<br>或腫瘤最大直徑 ≤ 4 cm，且具有以下一項或多項特徵：<br>- 侵犯臟層胸膜<br>- 侵犯鄰近肺葉<br>- 侵犯主支氣管 (但不涉及隆突)<br>- 伴隨肺不張或阻塞性肺炎，擴展至肺門區，影響部分或整個肺葉</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">T2b</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤最大直徑 > 4 cm 但 ≤ 5 cm，且可能具有以下特徵：<br>- 侵犯臟層胸膜<br>- 侵犯鄰近肺葉<br>- 侵犯主支氣管 (但不涉及隆突)<br>- 伴隨肺不張或阻塞性肺炎，擴展至肺門區，影響部分或整個肺葉</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">T3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤最大直徑 > 5 cm 但 ≤ 7 cm<br>或腫瘤最大直徑 ≤ 7 cm，且具有以下一項或多項特徵：<br>- 侵犯壁層胸膜或胸壁<br>- 侵犯心包、膈神經或奇靜脈<br>- 侵犯胸神經根 (T1、T2) 或星狀神經節<br>- 存在於與原發腫瘤同一肺葉的單獨腫瘤結節</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">T4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤最大直徑 > 7 cm<br>或腫瘤大小不限，但具有以下一項或多項特徵：<br>- 侵犯縱膈腔 (除 T3 所列結構外)、胸腺、氣管、隆突、喉返神經、迷走神經、食道或橫膈膜<br>- 侵犯心臟、大血管 (主動脈、上/下腔靜脈、心包內肺動脈/靜脈)、上肢動脈或頭臂靜脈<br>- 侵犯鎖骨下血管、椎體、椎弓板、脊髓管、頸神經根或臂神經叢 (包括幹、分支、索或終端神經)<br>- 存在於與原發腫瘤不同的 同側 肺葉中的單獨腫瘤結節</td>
          </tr>
        </table>
      `,
      'n': `
        <h3>N分期說明</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 15%;">N 分類</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">標準</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">NX</td>
            <td style="border: 1px solid #ddd; padding: 8px;">無法評估區域淋巴結</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">N0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">無區域淋巴結轉移被認</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">N1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤被認同側以下淋巴結站點之一或多處：<br>
              - 支氣管周圍淋巴結<br>
              - 肺門附近淋巴結<br>
              - 肺內淋巴結 (包括直接被侵犯的淋巴結)</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">N2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤被認同側縱隔淋巴結站點或氣管分岔下 (subcarinal) 淋巴結站點</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">N2a</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤被認單一站同側縱隔淋巴結站或氣管分岔下淋巴結站點</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">N2b</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤被認多個同側縱隔淋巴結站點，且可能性維低或無法分分下淋巴結站點的受侵</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">N3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">腫瘤被認下列對側縱隔道淋巴結站點之一或多處：<br>
              - 對側的縱隔或肺門淋巴結<br>
              - 同側或對側的斜角 (scalene) 淋巴結<br>
              - 同側或對側的鎖骨上淋巴結</td>
          </tr>
        </table>
      `,
      'm': `
        <h3>M分期說明</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 15%;">M 分類</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">標準</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">cM0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">無遠端轉移的證據</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">cM1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">存在遠端轉移</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">cM1a</td>
            <td style="border: 1px solid #ddd; padding: 8px;">轉移發生至以下部位之一或多處：<br>
              - 胸膜或心包結轉移<br>
              - 惡性胸膜或心包積液<br>
              - 對側肺葉內的單獨腫瘤結節<br><br>
              備註：大多數與肺癌相關的胸膜（或心包）積液是腫瘤所引起，然而，若於少數患者，經多次胸液檢查後，積液內未發現腫瘤細胞，且積液無血性且非滲出液，若根據這些條件及臨床判斷為積液與腫瘤無關，則不應將其視為 M1a。</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">cM1b</td>
            <td style="border: 1px solid #ddd; padding: 8px;">存在單一胸腔外器官系統的遠端轉移（包括單一非區域淋巴結轉移）</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">cM1c</td>
            <td style="border: 1px solid #ddd; padding: 8px;">存在多個胸腔外器官系統的遠端轉移</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">cM1c1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">存在單一器官系統內的多個遠端轉移<br><br>
              例如：當器官為單一器官，若多個器官內或多個器官間均有轉移，則歸類為 M1c1。</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">cM1c2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">存在多個器官系統內的多個遠端轉移</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">pM1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">經顯微鏡證實的遠端轉移</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">pM1a</td>
            <td style="border: 1px solid #ddd; padding: 8px;">經顯微鏡證實轉移至以下部位之一或多處：<br>
              - 胸膜或心包結轉移<br>
              - 惡性胸膜或心包積液<br>
              - 對側肺葉內的單獨腫瘤結節<br><br>
              備註：大多數與肺癌相關的胸膜（或心包）積液是腫瘤所引起，然而，若於少數患者，經多次胸液檢查後，積液內未發現腫瘤細胞，且積液無血性且非滲出液，若根據這些條件及臨床判斷為積液與腫瘤無關，則不應將其視為 M1a。</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">pM1b</td>
            <td style="border: 1px solid #ddd; padding: 8px;">經顯微鏡證實單一胸腔外器官系統的遠端轉移（包括單一非區域淋巴結轉移）</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">pM1c</td>
            <td style="border: 1px solid #ddd; padding: 8px;">經顯微鏡證實多個胸腔外器官系統的遠端轉移</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">pM1c1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">經顯微鏡證實單一器官系統內的多個遠端轉移<br><br>
              例如：當器官為單一器官，若多個器官內或多個器官間均有轉移，則歸類為 M1c1。</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">pM1c2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">經顯微鏡證實多個器官系統內的多個遠端轉移</td>
          </tr>
        </table>
      `
    };

    document.getElementById('help-content').innerHTML = helpContent[type];
    document.getElementById('help-modal').style.display = 'block';
    document.getElementById('modal-overlay').style.display = 'block';
  }

  // 關閉說明函數
  function closeHelp() {
    document.getElementById('help-modal').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'none';
  }
}); 