document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('close-sidebar');
    const overlay = document.getElementById('overlay');

    function toggleNav() {
        if (sidebar) sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
    }

    if (hamburger) hamburger.addEventListener('click', toggleNav);
    if (closeBtn) closeBtn.addEventListener('click', toggleNav);
    if (overlay) overlay.addEventListener('click', toggleNav);

    // FUNGSI UTAMA
    const radioMal = document.getElementById('mal');
    if (radioMal) {
        // VARIABEL
        const hargaEmas = 2321000;
        const hargaPerak = 26600;
        const hargaGabah = 8000;
        const nishabEmas = 85;
        const nishabPertanian = 653;
        const nishabRupiah = nishabEmas * hargaEmas;
        const zakatFitrahKg = 2.5;
        const hargaBerasPerKg = 15000;
        let jumlahZakatTerhitung = 0;

        const radioFitrah = document.getElementById('fitrah');
        const malContainer = document.getElementById('container-mal');
        const fitrahContainer = document.getElementById('container-fitrah');

        // FUNGSI RESET HASIL
        function resetHasil() {
            const hasil = document.getElementById('hasil');
            const info = document.getElementById('penjelasan');
            const distCont = document.getElementById('container-distribusi');
            const hasildist = document.getElementById('hasilDistribusi');
            const penjdist = document.getElementById('penjelasanlogikaDistribusi');

            if (hasil) hasil.innerHTML = '';
            if (info) info.innerHTML = 'Belum ada perhitungan.';
            if (distCont) distCont.classList.add('hidden');
            if (hasildist) hasildist.innerHTML = '';
            if (penjdist) penjdist.innerHTML = '';
            jumlahZakatTerhitung = 0;
        }

        // PILIHAN ZAKAT MAL / FITRAH
        radioMal.addEventListener('change', () => {
            if (radioMal.checked) {
                malContainer.classList.remove('hidden');
                fitrahContainer.classList.add('hidden');
                resetHasil();
            }
        });

        if (radioFitrah) {
            radioFitrah.addEventListener('change', () => {
                if (radioFitrah.checked) {
                    malContainer.classList.add('hidden');
                    fitrahContainer.classList.remove('hidden');
                    resetHasil();
                }
            });
        }

        // LOGIKA CHECKBOX ZAKAT MAL
        const zakatSection = [
            { checkId: 'emas', SectionId: 'emasSection' },
            { checkId: 'penghasilan', SectionId: 'penghasilanSection' },
            { checkId: 'pertanian', SectionId: 'pertanianSection' },
            { checkId: 'uang', SectionId: 'uangSection' },
            { checkId: 'niaga', SectionId: 'niagaSection' },
            { checkId: 'temuan', SectionId: 'temuanSection' }
        ];

        zakatSection.forEach(item => {
            const checkBox = document.getElementById(item.checkId);
            const section = document.getElementById(item.SectionId);

            if (checkBox && section) {
                section.style.display = 'none';

                checkBox.addEventListener('change', () => {
                    if (checkBox.checked) {
                        section.style.display = 'block';
                        section.classList.remove('sub-hidden');
                    } else {
                        section.style.display = 'none';
                        section.classList.add('sub-hidden');
                        const inputs = section.querySelectorAll('input');
                        inputs.forEach(i => i.value = '');
                    }
                    resetHasil();
                });
            }
        });

        // FUNGSI HITUNG & DISTRIBUSI ZAKAT
        window.cekZakat = function() {
            const isMal = document.getElementById('mal')?.checked;
            const isFitrah = document.getElementById('fitrah')?.checked;

            if (isMal) hitungZakatMal();
            else if (isFitrah) hitungZakatFitrah(); 
            else alert("Pilih jenis zakat dulu!");
        };

        window.distribusikanZakat = function() {
            const checks = document.querySelectorAll('.mustahik-check:checked');
            const count = checks.length;
            const divHasil = document.getElementById('hasilDistribusi');
            const divLogika = document.getElementById('penjelasanlogikaDistribusi');

            if (count === 0) {
                alert("Pilih minimal 1 golongan penerima.");
                return;
            }
            if (jumlahZakatTerhitung <= 0) {
                alert("Hitung zakat terlebih dahulu!");
                return;
            }

            const perOrg = jumlahZakatTerhitung / count;
            let listHTML = '<ul class="list-disc list-inside text-sm font-medium">';
            checks.forEach(c => {
                listHTML += `<li>${c.value}: ${formatRupiah(perOrg)}</li>`;
            });
            listHTML += '</ul>';

            divHasil.innerHTML = `<h4 class="font-bold mb-2">Hasil Pembagian:</h4>${listHTML}`;
            divLogika.innerHTML = `Distribusi rata ke ${count} golongan.`;
            divLogika.classList.remove('hidden');
        };

        // FUNGSI BANTUAN
        function getAngka(id) {
            const el = document.getElementById(id);
            return el ? (parseFloat(el.value) || 0) : 0;
        }

        function formatRupiah(number) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(number);
        }

        // LOGIKA UTAMA
        function hitungZakatMal() {
            let totalZakatRupiah = 0;
            let hasilHTML = '<ul class="list-disc list-inside text-sm">';
            let adaKewajiban = false;

            // Emas
            if (document.getElementById('emas')?.checked) {
                const gold = getAngka('beratEmas');
                const haul = getAngka('haulEmas');
                if (gold >= nishabEmas && haul >= 1) {
                    const z = (gold * 0.025) * hargaEmas;
                    totalZakatRupiah += z;
                    hasilHTML += `<li>Zakat Emas: ${formatRupiah(z)}</li>`;
                    adaKewajiban = true;
                }
            }

            // Penghasilan
            if (document.getElementById('penghasilan')?.checked) {
                const income = getAngka('gaji');
                const thn = income * 12;
                if (thn >= nishabRupiah) {
                    const z = income * 0.025;
                    totalZakatRupiah += z;
                    hasilHTML += `<li>Zakat Penghasilan (Per Bulan): ${formatRupiah(z)}</li>`;
                    adaKewajiban = true;
                }
            }

            // Pertanian
            if (document.getElementById('pertanian')?.checked) {
                const hasilTani = getAngka('hasilPertanian');
                if (hasilTani >= nishabPertanian) {
                    const nilaiTani = hasilTani * hargaGabah;
                    const z = nilaiTani * 0.05;
                    totalZakatRupiah += z;
                    hasilHTML += `<li>Zakat Pertanian (5%): ${formatRupiah(z)}</li>`;
                    adaKewajiban = true;
                }
            }

            // Tabungan
            if (document.getElementById('uang')?.checked) {
                const saldo = getAngka('totalUang');
                const lama = getAngka('lamaSimpan');
                if (saldo >= nishabRupiah && lama >= 1) {
                    const z = saldo * 0.025;
                    totalZakatRupiah += z;
                    hasilHTML += `<li>Zakat Tabungan: ${formatRupiah(z)}</li>`;
                    adaKewajiban = true;
                }
            }

            // Perniagaan
            if (document.getElementById('niaga')?.checked) {
                const aset = getAngka('asetNiaga');
                const laba = getAngka('labaNiaga');
                const hutang = getAngka('hutangNiaga');
                const haul = getAngka('haulNiaga');
                const kekayaanBersih = (aset + laba) - hutang;

                if (kekayaanBersih >= nishabRupiah && haul >= 1) {
                    const z = kekayaanBersih * 0.025;
                    totalZakatRupiah += z;
                    hasilHTML += `<li>Zakat Perniagaan: ${formatRupiah(z)}</li>`;
                    adaKewajiban = true;
                }
            }

            // Temuan
            if (document.getElementById('temuan')?.checked) {
                const nilaiTemuan = getAngka('nilaiTemuan');
                if (nilaiTemuan > 0) {
                    const z = nilaiTemuan * 0.20;
                    totalZakatRupiah += z;
                    hasilHTML += `<li>Zakat Temuan (20%): ${formatRupiah(z)}</li>`;
                    adaKewajiban = true;
                }
            }

            hasilHTML += '</ul>';

            const divHasil = document.getElementById('hasil');
            const divInfo = document.getElementById('penjelasan');

            if (adaKewajiban) {
                divHasil.innerHTML = `${hasilHTML}<hr class="divider"><div class="font-bold text-blue">Total Yang Harus Dikeluarkan: ${formatRupiah(totalZakatRupiah)}</div>`;
                divInfo.innerHTML = `Nishab Emas saat ini: <b>${formatRupiah(nishabRupiah)}</b>. <br>Harta Anda telah melampaui nishab dan syarat haul.`;
                jumlahZakatTerhitung = totalZakatRupiah;
                document.getElementById('container-distribusi').classList.remove('hidden');
                document.getElementById('totalZakatDistribusi').innerText = formatRupiah(jumlahZakatTerhitung);
            } else {
                divHasil.innerHTML = '<p class="text-red">Anda belum wajib zakat untuk kategori yang dipilih.</p>';
                divInfo.innerHTML = `Syarat Nishab: Setara 85gr Emas (${formatRupiah(nishabRupiah)}). <br>Pastikan harta mencapai nishab & haul (1 tahun).`;
                document.getElementById('container-distribusi').classList.add('hidden');
            }
        }

         function hitungZakatFitrah() {
            const jiwa = getAngka('jumlahJiwa');
            const divHasil = document.getElementById('hasil');
            if (jiwa > 0) {
                const uang = jiwa * zakatFitrahKg * hargaBerasPerKg;
                divHasil.innerHTML = `<div class="font-bold text-green-700">Bayar: ${formatRupiah(uang)}</div>`;
                jumlahZakatTerhitung = uang;
                document.getElementById('container-distribusi').classList.remove('hidden');
                document.getElementById('totalZakatDistribusi').innerText = formatRupiah(jumlahZakatTerhitung);
            } else {
                divHasil.innerHTML = '<p class="text-red">Masukkan jumlah jiwa.</p>';
            }
        }

    } 
});