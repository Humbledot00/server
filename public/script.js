document.getElementById('convertButton').addEventListener('click', function() {
    const element = document.querySelector('#container');
  
  html2pdf()
    .from(element)
    .outputPdf()
    .then(pdf => {
      // You can customize the filename here
      pdf.save('registration.pdf');
    });

    html2pdf().set(options).from(element).save();
});


const options = {
	filename: 'Registration.pdf',
	margin: 1,
	image: { type: 'jpeg', quality: 0.98 },
	html2canvas: { scale: 1},
	jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    header:
		'<div style="text-align:center;">Page <span class="page"></span> of <span class="total"></span></div>',
	footer:
		'<div style="text-align:center;">Generated by my app on ' +
		new Date().toLocaleDateString() +
		'</div>',
};

