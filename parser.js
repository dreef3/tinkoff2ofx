var Baby = require('babyparse');

module.exports = function (data) {
    function parseDate(s) {
        var b = s.split(/\D+/);
        return new Date(b[2], --b[1], b[0], b[3], b[4], b[5]);
    }

    var parseResult = Baby.parse(data);
    var rows = parseResult.data;
    var ofx = '';

    ofx += 'OFXHEADER:100\n';
    ofx += 'DATA:OFXSGML\n';
    ofx += 'VERSION:102\n';
    ofx += 'SECURITY:NONE\n';
    ofx += 'ENCODING:UTF-8\n';
    ofx += 'CHARSET:NONE\n';
    ofx += 'COMPRESSION:NONE\n';
    ofx += 'OLDFILEUID:NONE\n';
    ofx += 'NEWFILEUID:NONE\n\n';

    ofx += '<OFX>\n';
    ofx += '<BANKMSGSRSV1>\n';
    ofx += '<STMTRS>\n';
    ofx += '<BANKTRANLIST>\n\n';

    rows.forEach(function (row) {
        try {
            var date = parseDate(row[0]);
            var fullDateString = date.getFullYear()
                    + ('0' + (date.getMonth() + 1)).slice(-2)
                    + ('0' + date.getDate()).slice(-2)
                    + ('0' + date.getHours()).slice(-2)
                    + ('0' + date.getMinutes()).slice(-2)
                    + ('0' + date.getSeconds()).slice(-2);

            var amount = row[6].replace(',', '.');
            var name = row[8].trim();
            var mcc = row[9].trim();
            var memo = row[10].trim();

            ofx += '<STMTTRN>\n';
            ofx += '<TRNTYPE>PAYMENT\n';
            ofx += '<DTPOSTED>' + fullDateString.slice(0, 8) + '\n';
            ofx += '<TRNAMT>' + amount + '\n';
            ofx += '<FITID>' + fullDateString + '\n';
            ofx += '<NAME>' + name + '\n';
            ofx += '<MEMO>' + memo + '\n';
            ofx += '<MCC>' + mcc + '\n';
            ofx += '</STMTTRN>\n';
        } catch (ignored) {
        }
    });

    return ofx;
};
